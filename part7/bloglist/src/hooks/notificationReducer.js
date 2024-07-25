import { useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'success':
      return {
        successMessage: action.payload,
        errorMessage: null,
      }

    case 'error':
      return {
        successMessage: null,
        errorMessage: action.payload,
      }

    case 'remove':
      return { successMessage: null, errorMessage: null }

    default:
      throw Error('Unknown notification action')
  }
}

export const useNotificationReducer = () =>
  useReducer(notificationReducer, {
    successMessage: null,
    errorMessage: null,
  })
