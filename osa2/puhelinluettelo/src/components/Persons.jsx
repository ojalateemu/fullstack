const Persons = ({filter, persons, deletePerson}) => {
  const showPersons = (filter === '') ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    showPersons.map(person => (
      <p key={person.name}>
        {person.name} {person.number}<button onClick={() => deletePerson(person)}>delete</button>
      </p>
    ))
  )
}

export default Persons