import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    filterAnecdotesBy(state, action) {
      return action.payload
    },
  },
})

export default filterSlice.reducer
export const { filterAnecdotesBy } = filterSlice.actions
