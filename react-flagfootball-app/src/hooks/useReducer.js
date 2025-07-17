import { useReducer, useMemo } from 'react';

/**
 * Custom hook for creating standardized reducers with common patterns
 * @param {Object} initialState - Initial state object
 * @param {Object} actionTypes - Action type constants
 * @param {Function} customReducer - Custom reducer logic
 * @returns {Array} - [state, dispatch, actions]
 */
export const useStandardReducer = (initialState, actionTypes, customReducer = null) => {
  const createReducer = (actionTypes, customReducer) => {
    return (state, action) => {
      // Handle common loading patterns
      if (action.type.endsWith('_START')) {
        return {
          ...state,
          isLoading: true,
          error: null
        };
      }

      // Handle common success patterns
      if (action.type.endsWith('_SUCCESS')) {
        return {
          ...state,
          isLoading: false,
          error: null,
          ...action.payload
        };
      }

      // Handle common failure patterns
      if (action.type.endsWith('_FAILURE')) {
        return {
          ...state,
          isLoading: false,
          error: action.payload
        };
      }

      // Handle clear error
      if (action.type === 'CLEAR_ERROR') {
        return {
          ...state,
          error: null
        };
      }

      // Handle set loading
      if (action.type === 'SET_LOADING') {
        return {
          ...state,
          isLoading: action.payload
        };
      }

      // Use custom reducer if provided
      if (customReducer) {
        return customReducer(state, action);
      }

      return state;
    };
  };

  const reducer = createReducer(actionTypes, customReducer);
  const [state, dispatch] = useReducer(reducer, initialState);

  // Create action creators - memoize to prevent re-renders
  const actions = useMemo(() => {
    const actionCreators = {};

    // Create standard action creators for each action type
    Object.values(actionTypes).forEach(actionType => {
      // Convert ACTION_NAME to actionName (camelCase)
      const parts = actionType.toLowerCase().split('_');
      const actionName = parts[0] + parts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
      
      // Create action with exact name for consistency
      actionCreators[actionName] = (payload) => dispatch({ type: actionType, payload });
    });

    // Add common actions
    actionCreators.clearError = () => dispatch({ type: 'CLEAR_ERROR' });
    actionCreators.setLoading = (isLoading) => dispatch({ type: 'SET_LOADING', payload: isLoading });

    return actionCreators;
  }, [dispatch]); // Keep dispatch dependency but make it stable

  return [state, dispatch, actions];
}; 