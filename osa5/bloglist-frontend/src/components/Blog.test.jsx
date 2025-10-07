import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Testing Blog', () => {
  const blog = {
    title: 'This is a test blog',
    author: 'Testaaja',
    url: 'https://google.com',
    likes: 3,
    user: {
      name: 'Matti Meikäläinen',
      username: 'test'
    }
  }

  const updateLikes = vi.fn()

  beforeEach(() => {
    render(<Blog key={blog.id} blog={blog} updateLike={updateLikes} />)
  })

  test('Blog renders title & author but not url & likes', () => {
    const element = screen.findByText(blog.title)
    const url = screen.queryByText('https://google.com')
    const likes = screen.queryByText('likes')

    expect(element).toBeDefined()
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('clicking view button shows the url, likes and user', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText('https://google.com')
    const likes = screen.queryByText('likes')
    const userName = screen.queryByText('Matti Meikäläinen')
    const buttonText = screen.getByText('hide')

    expect(userName).toBeDefined()
    expect(url).toBeDefined()
    expect(likes).toBeDefined()
    expect(buttonText).toBeDefined()
  })

  test('clicking the like button twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    //console.log(updateLikes.mock.calls)

    expect(updateLikes.mock.calls).toHaveLength(2)
  })
})
