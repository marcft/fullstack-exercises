import { useState } from 'react'

import blogsService from '../services/blogs'

const BlogForm = ({
  token,
  blogs,
  setBlogs,
  setSuccessMessage,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      // If author = '' -> undefined (Will be set by the default parmeter)
      const checkedAuthor = author || undefined
      const returnedBlog = await blogsService.create(
        { title, checkedAuthor, url },
        token
      )
      console.log(returnedBlog.author)
      setSuccessMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`
      )
      setTimeout(() => {
        setSuccessMessage('')
      }, 5000)

      setBlogs(blogs.concat(returnedBlog))
    } catch (exception) {
      const error = exception.response.data.error
      setErrorMessage(error)
      setTimeout(() => {
        setErrorMessage('')
      }, 5000)
    } finally {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
  }

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
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
          <label htmlFor="blog-title">Url: </label>
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

export default BlogForm
