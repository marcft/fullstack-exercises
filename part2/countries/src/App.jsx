import { useState, useEffect } from 'react'

import serviceCountries from './services/countries'
import serviceWeather from './services/weather'

const PossibleCountries = ({ countries, onClick }) => {
  if (countries.length === 1) return null
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>
          <div style={{ display: 'inline-block' }}>{country.name}</div>
          <button onClick={onClick(country)}>show</button>
        </li>
      ))}
    </ul>
  )
}

const CountryInfo = ({ countries }) => {
  if (countries.length !== 1) return null

  const country = countries[0]

  return (
    <div>
      <h2>{country.name}</h2>
      <p>capital: {country.capital}</p>
      <p>area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.entries(country.languages).map(([, language]) => {
          return <li key={language}>{language}</li>
        })}
      </ul>
      <img src={country.flag} alt="Country Flag" />
    </div>
  )
}

const WeatherInfo = ({ weather }) => {
  if (weather == null) return

  return (
    <div>
      <h3>Weather in {weather.capital} </h3>
      <p>Temperature {weather.temperature} Celsius</p>
      <img src={weather.icon} alt="Weather Icon" />
      <p>Wind {weather.wind} km/h</p>
    </div>
  )
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [matchCountries, setMatchCountries] = useState([])
  const [weatherData, setWeatherData] = useState(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    serviceCountries.getAll().then((countriesData) => {
      setAllCountries(
        countriesData.map((countryData) => {
          return {
            name: countryData.name.common,
            capital: countryData.capital ? countryData.capital[0] : 'none',
            area: countryData.area,
            languages: countryData.languages,
            flag: countryData.flags.png,
          }
        })
      )
    })
  }, [])

  useEffect(() => {
    if (matchCountries.length !== 1) {
      setWeatherData(null)
      return
    }

    const country = matchCountries[0]
    serviceWeather.getByName(country.capital).then((data) => {
      const weatherObject = {
        capital: data.location.name,
        temperature: data.current.temp_c,
        icon: data.current.condition.icon,
        wind: data.current.wind_kph,
      }
      setWeatherData(weatherObject)
    })
  }, [matchCountries])

  const handleValueChange = (event) => {
    const currentValue = event.target.value
    setValue(currentValue)
    setMatchCountries(
      allCountries.filter((country) => {
        const processCountry = country.name.trim().toLowerCase()
        const processValue = currentValue.trim().toLowerCase()
        if (processValue === '') return
        return processCountry.includes(processValue)
      })
    )
  }

  const showCountry = (country) => () => {
    setValue(country.name)
    setMatchCountries([country])
  }

  return (
    <>
      <h1>Countries Data</h1>
      <div>
        find countries:{' '}
        <input type="text" value={value} onChange={handleValueChange} />
        <PossibleCountries countries={matchCountries} onClick={showCountry} />
      </div>
      <CountryInfo countries={matchCountries} />
      <WeatherInfo weather={weatherData} />
    </>
  )
}

export default App
