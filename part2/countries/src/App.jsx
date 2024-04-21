import { useState, useEffect } from 'react'

import serviceCountries from './services/countries'

const PossibleCountries = ({ countries }) => {
  if (countries.length === 1) return null
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.name}>{country.name}</li>
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

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [matchCountries, setMatchCountries] = useState([])
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

  return (
    <>
      <h1>Countries Data</h1>
      <div>
        find countries:{' '}
        <input type="text" value={value} onChange={handleValueChange} />
        <PossibleCountries countries={matchCountries} />
      </div>
      <CountryInfo countries={matchCountries} />
    </>
  )
}

export default App
