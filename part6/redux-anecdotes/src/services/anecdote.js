import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnecdote = async (content) => {
  const response = await axios.post(baseUrl, { content, votes: 0 })
  return response.data
}

const modifyAnecdote = async (modifiedAnecdote) => {
  const { id, ...anecdoteBody } = modifiedAnecdote
  const response = await axios.put(`${baseUrl}/${id}`, anecdoteBody)
  return response.data
}

export default { getAll, createAnecdote, modifyAnecdote }
