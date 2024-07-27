import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import UserContext from '../../UserContext'
import blogService from '../../services/blogs'

import { Button, Input } from '../../styled-components'

const SingleBlog = ({ blog, updateBlog, deleteBlog, notify }) => {
  const [user] = useContext(UserContext)
  const queryClient = useQueryClient()
  const [comment, setComment] = useState('')

  const newCommentMutation = useMutation({
    mutationFn: ({ id, comment, token }) =>
      blogService.createComment(id, comment, token),
    onSuccess: (commentedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) => (b.id == commentedBlog.id ? commentedBlog : b)),
      )

      notify(`a new comment has been added`, 'success')
    },
    onError: (exception) => {
      const error = exception.response.data.error
      notify(error, 'error')
    },
  })

  const handleCommentSubmit = (event) => {
    event.preventDefault()

    newCommentMutation.mutate({ id: blog.id, comment, token: user.token })
  }

  const likeBlog = () => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    updateBlog(likedBlog)
  }

  const removeBlog = () => {
    const isConfirmed = window.confirm(`Remove ${blog.title}, ${blog.author}`)
    if (isConfirmed) deleteBlog()
  }

  return (
    <>
      <h2>
        {blog.title}, by {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <p>
        likes <span className="likes-value">{blog.likes}</span>{' '}
        <Button onClick={likeBlog}>like</Button>
      </p>
      <p>added by {blog.user.name}</p>
      {user.username === blog.user.username && (
        <Button onClick={removeBlog}>remove</Button>
      )}

      <h3>Comments</h3>
      <form onSubmit={handleCommentSubmit}>
        <Input
          type="text"
          name="comment"
          value={comment}
          onChange={({ target }) => {
            setComment(target.value)
          }}
        />
        <Button type="submit">add comment</Button>
      </form>
      <ul>
        {blog.comments.map((comment, index) => (
          <li key={`${index} - ${comment}`}>{comment}</li>
        ))}
      </ul>
    </>
  )
}

SingleBlog.propTypes = {
  blog: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    comments: PropTypes.array.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
}

export default SingleBlog
