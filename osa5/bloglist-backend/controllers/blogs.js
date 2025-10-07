const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = new Blog(request.body)
  const user = request.user

  if (!blog.title || !blog.url) {
    return response.status(400).send({ error: 'The title or url is missing' })
  }

  const newBlog = new Blog({
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).send({ error: 'blog does not exist' })
  }
  if ( blog.user.toString() !== user._id.toString() ) {
    return response.status(400).send({ error: 'the blog can only be deleted by the person who added it', deleter: user._id, blogCreator: blog.user })
  }

  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (e) {
    next(e)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  const id = request.params.id
  try {
    const blog = await Blog.findById(id)

    if (!blog) {
      return response.status(404).end()
    }

    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const result = await blog.save()
    return response.json(result)
  } catch (e) {
    next(e)
  }
})



module.exports = blogsRouter