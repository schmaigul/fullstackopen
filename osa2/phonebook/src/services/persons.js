import axios from 'axios'
const baseUrl = `http://localhost:3001/persons`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const remove = (id) => {
    const request = axios.delete(baseUrl.concat(`/${id}`))
    return request.then(response => response)
}

const update = (newPerson) => {
    const request = axios.put(baseUrl.concat(`/${newPerson.id}`), newPerson)
    return request.then(response => response.data)
}

export default {getAll, create, remove, update}