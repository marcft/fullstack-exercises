import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> calls createBlog handler with correct details', async () => {
  const blogToCreate = {
    title: 'Test Title',
    author: 'Tester',
    url: 'http://testurl.com',
  }

  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = container.querySelector('#blog-title')
  await user.type(titleInput, blogToCreate.title)

  const authorInput = container.querySelector('#blog-author')
  await user.type(authorInput, blogToCreate.author)

  const urlInput = container.querySelector('#blog-url')
  await user.type(urlInput, blogToCreate.url)

  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(blogToCreate)
})
