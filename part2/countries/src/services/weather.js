import axios from 'axios'

const apiKey = import.meta.env.VITE_API_KEY
const baseUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&aqi=no`

const getByName = (name) =>
  axios.get(`${baseUrl}&q=${name}`).then((response) => response.data)

export default { getByName }
