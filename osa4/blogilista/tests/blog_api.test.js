const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('testing Users API', () => {
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
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
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

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username or password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username or password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('blogs API testing', () => {
  let token
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    token = await helper.extractToken()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('GET request to /api/blogs returns all blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('Identifier key should have name "id" for all blogs', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.ok(blog.id)
      assert.ok(!blog._id)
    })
  })

  test('POST request to /api/blogs adds a blog if it has a valid token', async () => {
    const blogsAtStart = await helper.blogsInDb()
    await api
      .post('/api/blogs')
      .set({ Authorization: token })
      .send(helper.newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes(helper.newBlog.title))

    const authors = blogsAtEnd.map(b => b.author)
    assert.ok(authors.includes(helper.newBlog.author))

    const urls = blogsAtEnd.map(b => b.url)
    assert.ok(urls.includes(helper.newBlog.url))

    const likes = blogsAtEnd.map(b => b.likes)
    assert.ok(likes.includes(helper.newBlog.likes))
  })

  test('if likes value is empty default value will be 0', async () => {
    const response = await api.post('/api/blogs').set({ Authorization: token }).send(helper.emptyLikes) 
    assert.strictEqual(response.body.likes, 0)
  })

  test('if new blog doesn\'t have a title the response will be 400 Bad Request', async () => {
    await api.post('/api/blogs').set({ Authorization: token }).send(helper.emptyTitle).expect(400)
  })

  test('if new blog doesn\'t have a url the response will be 400 Bad Request', async () => {
    await api.post('/api/blogs').set({ Authorization: token }).send(helper.emptyURL).expect(400)
  })

  test('if new blog doesn\'t have a token the response will be 401 Unauthorized', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const response = await api.post('/api/blogs').send(helper.newBlog).expect(401)
    
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(!titles.includes(helper.newBlog.title))
    assert.strictEqual(response.body.error, 'token missing or invalid')
  })

  test('DELETE request to /api/blogs/:id deletes a blog', async () => {
    const blogToDelete = await api.post('/api/blogs').set({ Authorization: token }).send(helper.newBlog)
    const blogsAfterAdding = await helper.blogsInDb()

    await api.delete(`/api/blogs/${blogToDelete.body.id}`).set({ Authorization: token }).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, blogsAfterAdding.length - 1)
  })

  test('PUT request to /api/blogs/:id updates a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const id = blogToUpdate.id

    blogToUpdate.title = "Updated title"
    blogToUpdate.likes = 66

    const response = await api.put(`/api/blogs/${id}`).send(blogToUpdate).expect(200).expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.title, "Updated title")
    assert.strictEqual(response.body.likes, 66)
  })
})

after(async () => {
  await mongoose.connection.close()
})