import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const request = await axios.post(baseUrl, blog, config)
  return request.data
}

const update = async (id, blog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  const request = await axios.put(`${baseUrl}/${id}`, blog, config)
  return request.data
}

const remove = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, create, update, remove }
