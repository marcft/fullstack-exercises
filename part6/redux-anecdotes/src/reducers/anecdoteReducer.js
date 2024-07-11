import { createSlice } from '@reduxjs/toolkit'

import anecdoteService from '../services/anecdote'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    modifyAnecdote(state, action) {
      return state.map((anecdote) =>
        anecdote.id === action.payload.id ? action.payload : anecdote
      )
    },
    appendAnecdote(state, action) {
      // Immer lets us mute the state, internally it is inmutable
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

export const { modifyAnecdote, appendAnecdote, setAnecdotes } =
  anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createAnecdote(content)
    dispatch(appendAnecdote(anecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async (dispatch) => {
    const votedAnecdote = await anecdoteService.modifyAnecdote({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
    dispatch(modifyAnecdote(votedAnecdote))
  }
}

export default anecdoteSlice.reducer
