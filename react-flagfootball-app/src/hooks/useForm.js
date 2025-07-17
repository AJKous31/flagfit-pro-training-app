import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Validation rules
 * @param {Function} onSubmit - Submit handler
 * @returns {Object} - Form state and handlers
 */
export const useForm = (initialValues, validationSchema = {}, onSubmit = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Validate a single field
   * @param {string} name - Field name
   * @param {any} value - Field value
   * @returns {string|null} - Error message or null
   */
  const validateField = useCallback((name, value) => {
    const rules = validationSchema[name];
    if (!rules) return null;

    for (const rule of rules) {
      const { test, message } = rule;
      if (!test(value)) {
        return message;
      }
    }
    return null;
  }, [validationSchema]);

  /**
   * Validate all fields
   * @returns {Object} - Validation errors
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationSchema, validateField]);

  /**
   * Handle input change
   * @param {Event} e - Change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prev => ({
      ...prev,
      [name]: fieldValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, [errors]);

  /**
   * Handle input blur
   * @param {Event} e - Blur event
   */
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, [validateField]);

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm, onSubmit]);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set form values
   * @param {Object} newValues - New form values
   */
  const setFormValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  /**
   * Set field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  /**
   * Clear field error
   * @param {string} name - Field name
   */
  const clearFieldError = useCallback((name) => {
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFieldError,
    clearFieldError,
    clearErrors,
    validateForm,
    validateField
  };
};

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = 'This field is required') => ({
    test: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
    message
  }),
  
  email: (message = 'Please enter a valid email address') => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message
  }),
  
  minLength: (min, message = `Must be at least ${min} characters`) => ({
    test: (value) => value && value.length >= min,
    message
  }),
  
  maxLength: (max, message = `Must be no more than ${max} characters`) => ({
    test: (value) => value && value.length <= max,
    message
  }),
  
  password: (message = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character') => ({
    test: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    message
  }),
  
  confirmPassword: (passwordField, message = 'Passwords do not match') => ({
    test: (value, allValues) => value === allValues[passwordField],
    message
  })
}; 