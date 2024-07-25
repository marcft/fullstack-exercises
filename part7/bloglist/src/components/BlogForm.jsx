import { useState } from 'react'
import PropTypes from 'prop-types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

import blogService from '../services/blogs'

const BlogForm = ({ notify, userToken }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: ({ blog, token }) => blogService.create(blog, token),
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))

      notify(
        `a new blog ${newBlog.title} by ${newBlog.author} has been added`,
        'success',
      )

      setTitle('')
      setAuthor('')
      setUrl('')
    },
    onError: (exception) => {
      const error = exception.response.data.error
      notify(error, 'error')
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    // If author = '' -> undefined (Will be setted by the default parmeter)
    const checkedAuthor = author || undefined
    newBlogMutation.mutate({
      blog: { author: checkedAuthor, title, url },
      token: userToken,
    })
  }

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label htmlFor="blog-title">Title: </label>
          <input
            type="text"
            id="blog-title"
            name="title"
            value={title}
            onChange={({ target }) => {
              setTitle(target.value)
            }}
          />
        </p>
        <p>
          <label htmlFor="blog-author">Author: </label>
          <input
            type="text"
            id="blog-author"
            name="author"
            value={author}
            onChange={({ target }) => {
              setAuthor(target.value)
            }}
          />
        </p>
        <p>
          <label htmlFor="blog-url">Url: </label>
          <input
            type="text"
            id="blog-url"
            name="url"
            value={url}
            onChange={({ target }) => {
              setUrl(target.value)
            }}
          />
        </p>
        <button type="submit">create</button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  notify: PropTypes.func.isRequired,
  userToken: PropTypes.string.isRequired,
}

export default BlogForm
