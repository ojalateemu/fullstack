import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('Testing BlogForm', () => {
  test('<BlogForm /> calls callback function onSubmit with correct data', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)
    const title = 'This is a test title'
    const author = 'Test-author'
    const url = 'https://test.com'

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)
    await user.click(sendButton)

    //console.log(createBlog.mock.calls)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(title)
    expect(createBlog.mock.calls[0][0].author).toBe(author)
    expect(createBlog.mock.calls[0][0].url).toBe(url)
  })
})

