import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id !== action.payload
          ? anecdote
          : { ...anecdote, votes: anecdote.votes + 1 }
      )
    },
    createAnecdote(state, action) {
      // Immer lets us mute the state, internally it is inmutable
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export default anecdoteSlice.reducer
export const { voteAnecdote, createAnecdote, setAnecdotes } =
  anecdoteSlice.actions
