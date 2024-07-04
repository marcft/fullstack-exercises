import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('pressing like two times calls handler two times', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 1,
    user: {
      id: 'testId',
      username: 'test',
      name: 'Tester',
    },
  }
  const updateBlog = vi.fn()

  render(
    <Blog
      blog={blog}
      userUsername="test"
      updateBlog={updateBlog}
      deleteBlog={() => {}}
    />
  )

  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(updateBlog.mock.calls).toHaveLength(2)
})
