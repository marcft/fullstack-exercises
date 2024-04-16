import { useState } from 'react'

const Person = ({ person }) => {
  return <div>{`${person.name} ${person.number}`}</div>
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
      <div>
        filter shown with:{' '}
        <input type="text" value={filter} onChange={handleFilterChange} />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{' '}
          <input type="text" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number:{' '}
          <input type="text" value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map((person) => (
          <Person key={person.name} person={person} />
        ))}
      </div>
    </div>
  )
}

export default App
