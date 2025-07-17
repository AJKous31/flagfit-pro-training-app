import { useForm as useHookForm } from 'react-hook-form'

// Enhanced form hook with common patterns using React Hook Form
export const useReactHookForm = (options = {}) => {
  const {
    defaultValues = {},
    mode = 'onChange',
    reValidateMode = 'onChange',
    resolver,
    ...restOptions
  } = options

  const form = useHookForm({
    defaultValues,
    mode,
    reValidateMode,
    resolver,
    ...restOptions
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    reset,
    setValue,
    getValues,
    watch,
    control,
    register
  } = form

  // Helper to get error message for a field
  const getErrorMessage = (fieldName) => {
    return errors[fieldName]?.message || ''
  }

  // Helper to check if field has error
  const hasError = (fieldName) => {
    return !!errors[fieldName]
  }

  // Helper to submit with error handling
  const onSubmit = (submitHandler, errorHandler) => {
    return handleSubmit(
      submitHandler,
      errorHandler || ((errors) => {
        console.error('Form validation errors:', errors)
      })
    )
  }

  return {
    register,
    control,
    handleSubmit: onSubmit,
    errors,
    isSubmitting,
    isValid,
    isDirty,
    reset,
    setValue,
    getValues,
    watch,
    getErrorMessage,
    hasError,
    ...form
  }
}

export default useReactHookForm