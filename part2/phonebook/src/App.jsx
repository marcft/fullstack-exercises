import { useState } from 'react'

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

const ShowPersons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person key={person.name} person={person} />
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already in phonebook`)
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }
    setPersons(persons.concat(newPerson))
    setNewName('')
    setNewNumber('')
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
      <ShowPersons persons={filteredPersons} />
    </div>
  )
}

export default App
