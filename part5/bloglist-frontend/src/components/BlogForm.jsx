import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    // If author = '' -> undefined (Will be setted by the default parmeter)
    const checkedAuthor = author || undefined
    const isCreated = await createBlog({ author: checkedAuthor, title, url })

    if (isCreated) {
      setTitle('')
      setAuthor('')
      setUrl('')
    }
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
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
