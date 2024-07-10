const filterReducer = (state = '', action) => {
  if (action.type == 'FILTER') {
    return action.payload
  }
  return state
}

export const filterAnecdotesBy = (filter) => ({
  type: 'FILTER',
  payload: filter,
})

export default filterReducer
