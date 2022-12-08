import { useState, useEffect } from 'react'
import React from 'react';
import Persons from "./components/Persons"
import PersonForm from "./components/PersonForm"
import Filter from "./components/Filter"
import personService from "./services/persons"
import Notification from "./components/Notification"


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorState, setError] = useState(null)

  useEffect(() => {
    personService.getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const filterNames = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()
    const added = persons.some(person => person.name === newName)
    const foundPerson = persons.find(person => person.name === newName)
    if (added) {
      if (window.confirm(`${foundPerson.name} is already added to phonebook, replace the old
      number with a new one?`)) {
        const updatePerson = { ...foundPerson, number: newNumber }
        personService.update(updatePerson)
          .then(newData => {
            console.log(newData)
            setPersons(persons.map(person => person.id === newData.id ? newData : person))
            setError(`Updated ${newName}`)
            setTimeout(() => {
              setError(null)
            }, 3000)
            setNewName("")
            setNewNumber("")
          })
          .catch(error => {
            setError(`Error: ${error.response.data.error}`)
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      personService
        .create(personObject)
        .then(data => {
          setPersons(persons.concat(data))
          setError(`Added ${newName}`)
          setTimeout(() => {
            setError(null)
          }, 3000)
          setNewName("")
          setNewNumber("")
        })
        .catch(error => {
          setError(`Error: New credentials are not valid`)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    }
  }

  const deletePerson = id => {
    const filteredPerson = persons.find(person => person.id === id)
    const personId = filteredPerson.id
    const personName = filteredPerson.name
    if (window.confirm(`Delete ${personName} ?`) === true)
      personService.remove(personId)
        .then(newData => {
          console.log(newData)
          setPersons(persons.filter(person => person.id !== personId))
          setError(`Deleted ${personName}`)
          setTimeout(() => {
            setError(null)
          }, 3000)
        })
        .catch(error => {
          setError(`Error: Information of ${personName} has already been removed from the server`)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorState} />
      <Filter filter={filter} handler={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm addPerson={addPerson} nameState={[newName, handleNameChange]} numberState={[newNumber, handleNumberChange]} />
      <h3>Numbers</h3>
      <Persons filter={filterNames} deletePerson={deletePerson} />
    </div>
  )
}

export default App