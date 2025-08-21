import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  console.log(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect( () => {
    personService.getAll()
      .then( personsData => {
        setPersons(personsData)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      const msg = window.confirm(`${newName} already exists in the phonebook. Do you want to replace the old number with a new one?`)
      if (msg) {
        // find the existing person's id
        const existingPerson = persons.find(person => person.name === newName)
        // make the new updated person object
        const updatedPerson = { ...existingPerson, number: newNumber }
        personService.update(updatedPerson)
          .then((returnedPerson) => {
            setPersons(persons.map(p => p.id === updatedPerson.id ? returnedPerson : p))
            createNotification(`Successfully changed the phone number of ${newName}`, 
                                'success',
                                 4000)
          })
          .catch(e => {
            console.log(e)
            const msg = `Information of ${newName} has already been removed from the server.`
            createNotification(msg, 'fail', 4000)
            setPersons(persons.filter(p => p.id != updatedPerson.id))
          })
        
      }
      setNewName('')
      setNewNumber('')
      return
    }
    // initialize new person object
    const newPerson = { name: newName, number: newNumber }
    personService.add(newPerson)
      .then( personData => {
        setPersons(persons.concat(personData))
        createNotification(`Succesfully added ${newName}`, 'success', 4000)
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name} from the phonebook?`)) {
      personService.deletePerson(person.id).then( () => {
          const arr = persons.filter( p => p.id !== person.id )
          setPersons(arr)
          createNotification(`Succesfully deleted ${person.name}`, 'success', 4000)
        })
    } else return
  }

  const createNotification = (msg, className, time) => {
    setNotification({ message: msg, className: className })
    setTimeout(() => setNotification(null), time)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter change={handleFilter}/>
      <h3>Add a new</h3>
      <PersonForm submit={addPerson} name={handleNameChange} number={handlePhoneChange} newName={newName} newNumber={newNumber} />
      <h3>Numbers</h3>
      <Persons filter={filter} persons={persons} deletePerson={deletePerson} />
    </div>
  )

}

export default App