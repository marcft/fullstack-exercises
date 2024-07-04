import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TogglableBlog from './TogglableBlog'

describe('<TogglableBlog />', () => {
  let container

  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 5,
  }

  beforeEach(() => {
    container = render(
      <TogglableBlog title={`${blog.title}, ${blog.author}`}>
        <p>{blog.url}</p>
        <p>{blog.likes}</p>
      </TogglableBlog>
    ).container
  })

  test('at start only the title and author are displayed', async () => {
    await screen.findAllByText(blog.title, { exact: false })
    await screen.findAllByText(blog.author, { exact: false })

    const togglableContent = container.querySelector('.togglable-content')

    expect(togglableContent).toHaveStyle('display: none')
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = container.querySelector('.toggle-button')
    await user.click(button)

    const togglableContent = container.querySelector('.togglable-content')
    expect(togglableContent).not.toHaveStyle('display: none')
  })
})
