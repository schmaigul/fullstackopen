const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)

    await User.deleteMany({})
    
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    
    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return token = jwt.sign(
        userForToken,
        process.env.SECRET
    )
})

describe('when there is initially some blogs saved', () => {

    test('correct amount of blogs returned', async () => {
        const response = await api.get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('identifier is based by _id property', async () => {
        const response = await api.get('/api/blogs')
            .set('Authorization', `bearer ${token}`)
    
        expect(response.body[0].id).toBeDefined()
        expect(response.body[0]._id).toBe(undefined)
    })
})

describe('adding a blog', () => {

    test('creating a new blog post', async () => {
        const newBlog = {
            title: 'isot sterkat',
            author: 'happoteknoilija',
            url: 'ejfoiesjfoiasejfgeosif',
            likes: 2
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain(
            'isot sterkat'
        )
    })

    test('blog has zero likes by default', async () => {
        const newBlog = {
            title: 'isot sterkat',
            author: 'happoteknoilija',
            url: 'ejfoiesjfoiasejfgeosif'
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const blogsAtEnd = await helper.blogsinDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    
        const likes = blogsAtEnd.map(b => b.likes)
        expect(likes).toContain(0)
    })
    
    test('title missing returns 400', async () => {
        const newBlog = {
            author: 'happoteknoilija',
            url: 'ejfoiesjfoiasejfgeosif',
            likes: 2
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
    
    test('url missing returns 400', async () => {
        const newBlog = {
            title: 'isot sterkat',
            author: 'happoteknoilija',
            likes: 2
        }
    
        await api
            .post('/api/blogs')
            .set('Authorization', `bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('modifying and deleting blogs', () => {
    
    test('deleting a blog', async () => {

        const newBlog = {
            title: 'blogg',
            author: 'hummusmummus',
            url: 'facebook.com'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const blogsbefore = await helper.blogsinDb()

        const blogToDelete = await Blog.findById(response.body.id)

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `bearer ${token}`)
            .expect(200)

        const blogsafter = await helper.blogsinDb()

        expect(blogsafter).toHaveLength(
            blogsbefore.length-1
        )
        
        const contents = blogsafter.map(b => b.title)

        expect(contents).not.toContain(blogToDelete.content)
    })

    test('editing likes of a blog', async () => {
        const blogsAtStart = await helper.blogsinDb()
        const blogToMod = blogsAtStart[0]
        blogToMod.likes += 2

        await api
            .put(`/api/blogs/${blogToMod.id}`)
            .send(blogToMod)
            .set('Authorization', `bearer ${token}`)
            .expect(200)

        const blogsAfter = await helper.blogsinDb()
        const blogModified = blogsAfter[0]

        expect(blogModified.likes).toBe(blogToMod.likes)
    })

    test('editing title of a blog', async () => {
        const blogsAtStart = await helper.blogsinDb()
        const blogToMod = blogsAtStart[0]
        blogToMod.title = 'koulupäivä'

        await api
            .put(`/api/blogs/${blogToMod.id}`)
            .set('Authorization', `bearer ${token}`)
            .send(blogToMod)
            .expect(200)

        const blogsAfter = await helper.blogsinDb()
        const blogModified = blogsAfter[0]

        expect(blogModified.title).toBe(blogToMod.title)
    })
})

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
    
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
    
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',    
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    
        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('username must be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
      })
})

afterAll(() => {
    mongoose.connection.close()
})