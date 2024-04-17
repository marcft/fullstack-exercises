import { useState, useEffect } from 'react'
import servicePersons from './services/persons'

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

  useEffect(() => {
    servicePersons.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newName.trim().toLowerCase()
    )
    if (existingPerson) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmed) return

      const changedPerson = { ...existingPerson, number: newNumber }
      servicePersons
        .update(changedPerson.id, changedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id == changedPerson.id ? returnedPerson : person
            )
          )
          setNewName('')
          setNewNumber('')
        })
    } else {
      const newPerson = {
        name: newName.trim(),
        number: newNumber.trim(),
      }

      servicePersons.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const deletePerson = (person) => () => {
    if (!window.confirm(`Delete ${person.name}`)) return
    servicePersons.remove(person.id).then(() => {
      setPersons(persons.filter((p) => p.id !== person.id))
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
