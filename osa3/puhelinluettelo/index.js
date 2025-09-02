require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('body', req => { return JSON.stringify(req.body) })

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
/*
let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: '2'
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: '3'
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: '4'
  }
]
*/
app.get('/', (request, response) => {
  response.send('<h1>This is a phonebook</h1>')
})
app.get('/info', (request, response, next) => {
  Person.find({}).then(people => {
    response.send(`<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person ({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    console.log(`added ${name} number ${number} to phonebook`)
    response.json(savedPerson)
  }).catch(e => next(e))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    }).catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})