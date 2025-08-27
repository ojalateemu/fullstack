const express = require('express')
const morgan = require('morgan')

morgan.token('body', req => { return JSON.stringify(req.body) })

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: "2"
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: "3"
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: "4"
    }
]
app.get('/', (request, response) => {
  response.send('<h1>This is a phonebook</h1>')
})
app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})
app.get('/api/persons', (request, response) => {
  response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(x => x.id === id)

    if (person) {
        response.json(person)
    } else {
        return response.status(404).end()
    }    
})
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
app.post('/api/persons', (request, response) => {
    const {name, number} = request.body

    if (!name || !number) {
        return response.status(400).json({
            error: 'The name or number of the person is missing'
        })
    }
    if (persons.find(p => p.name === name)) {
        return response.status(400).json({
            error: 'The name must be unique'
        })
    }

    const id = Math.floor(Math.random() * 10000)
    const person = {
        name: name,
        number: number,
        id: `${id}`
    }
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})