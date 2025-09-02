const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const dbase = 'phonebookApp'

const url = `mongodb+srv://tojala:${password}@cluster0.mlqysn3.mongodb.net/${dbase}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 3) { // no new person, log all phonebook persons
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) { // add new person, log added person
  const name = process.argv[3]
  const number =  process.argv[4]
  const person = new Person({
    name: name,
    number: number,
  })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  console.log('Shutting down service.. not sufficient arguments')
  mongoose.connection.close()
}


/*
const person = new Person({
  name: 'Testi-Nimi',
  number: '+358-123567',
})

person.save().then(result => {
  console.log(`added ${result} to phonebook`)
  mongoose.connection.close()
})
*/