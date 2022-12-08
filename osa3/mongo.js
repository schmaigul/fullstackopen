const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('You need to give a password to the database')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://schmaigul:${password}@cluster0.mqsoopq.mongodb.net/?retryWrites=true&w=majority`

mongoose
    .connect(url)
    .then((result) => {
        console.log('Connected to the database')
    })
    .catch((error) => {
        console.log(error)
    })

const personSchema =  new mongoose.Schema({
    name : String,
    number: Number,
})

const Person = mongoose.model(('Person'), personSchema)

if (process.argv.length === 3) {

    console.log('phonebook:')

    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) {

    const given_name = process.argv[3]
    const given_number = process.argv[4]

    const person = new Person({
        name: given_name,
        number: Number(given_number),
    })

    person.save()
        .then(result => {
            console.log(`added ${given_name} number ${given_number} to phonebook`)
            mongoose.connection.close()
        })
}
