/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
var app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons/', (req, res) => {
    Person.find({}).then(allPersons => {
        res.json(allPersons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch((error) => {
            next(error)
        })
})

app.post('/api/persons/', (request, response, next) => {

    const body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedFormattedPerson => {
            response.json(savedFormattedPerson)
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id/', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id/', (request, response, next) => {

    const{ name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators:true, context:'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (req, res) => {
    const date = new Date().toString()

    Person.find({}).then(allPersons => {
        res.send(
            `<p>Phonebook has info for ${allPersons.length} people</p>
            <p>${date}</p>`
        )
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error : 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error:'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})