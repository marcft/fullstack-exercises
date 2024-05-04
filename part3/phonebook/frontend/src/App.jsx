import { useState, useEffect } from 'react'
import servicePersons from './services/persons'
import {
  SuccessNotification,
  ErrorNotification,
} from './components/Notification'

const Filter = ({ filterValue, onFilterChange }) => {
  return (
    <div>
      filter shown with:{' '}
      <input type="text" value={filterValue} onChange={onFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
      <div>
        name:{' '}
        <input
          type="text"
          value={props.newName}
          onChange={props.onNameChange}
        />
      </div>
      <div>
        number:{' '}
        <input
          type="text"
          value={props.newNumber}
          onChange={props.onNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person }) => {
  return <div>{`${person.name} ${person.number}`}</div>
}

const ShowPersons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.name}>
          <Person person={person} />
          <button onClick={deletePerson(person)}>delete</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    servicePersons.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const changeNumber = (existingPerson) => {
    const confirmed = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )
    if (!confirmed) return

    const changedPerson = { ...existingPerson, number: newNumber }
    servicePersons
      .update(existingPerson.id, changedPerson)
      .then((returnedPerson) => {
        setPersons(
          persons.map((person) =>
            person.id == changedPerson.id ? returnedPerson : person
          )
        )
        setNewName('')
        setNewNumber('')
        setSuccessMessage(
          `${changedPerson.name}'s number successfully changed to ${changedPerson.number}`
        )
        setTimeout(() => setSuccessMessage(null), 5000)
      })
      .catch(({ response }) => {
        if (response.status === 404) {
          setErrorMessage(
            `Information of ${changedPerson.name} has already been removed from server`
          )
          setPersons(persons.filter((p) => p.id !== changedPerson.id))
        } else {
          setErrorMessage(response.data.error || 'Some error happened')
        }
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.trim().toLowerCase()
    )
    if (existingPerson) {
      changeNumber(existingPerson)
    } else {
      const newPerson = {
        name: newName.trim(),
        number: newNumber.trim(),
      }

      servicePersons
        .create(newPerson)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(
            `${returnedPerson.name} has been successfully added to phonebook`
          )
          setTimeout(() => setSuccessMessage(null), 5000)
        })
        .catch(({ response }) => {
          setErrorMessage(response.data.error || 'Some error happened')
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }

  const deletePerson = (person) => () => {
    if (!window.confirm(`Delete ${person.name}`)) return
    servicePersons
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
      })
      .catch(({ response }) => {
        setErrorMessage(response.data.error || 'Some error happened')
        setTimeout(() => setErrorMessage(null), 5000)
      })
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const filteredPersons = persons.filter((person) => {
    const comparableFilter = filter.trim().toLowerCase()
    return person.name.toLowerCase().startsWith(comparableFilter)
  })

  return (
    <div>
      <h1>Phonebook</h1>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message={errorMessage} />
      <Filter filterValue={filter} onFilterChange={handleFilterChange} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
        addPerson={addPerson}
      />
      <h2>Numbers</h2>
      <ShowPersons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  )
}

export default App
