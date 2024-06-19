const dummy = () => 1

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0)

const favoriteBlog = (blogs) => {
  return blogs.reduce(
    (fav, blog) =>
      blog.likes > fav.likes
        ? {
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
          }
        : fav,
    { title: 'Any blog found', author: 'None', likes: -1 },
  )
}

const mostBlogs = (blogs) => {
  const authorBlogs = {}
  blogs.forEach((blog) => {
    const { author } = blog
    !authorBlogs[author] ? (authorBlogs[author] = 1) : authorBlogs[author]++
  })

  const authors = Object.keys(authorBlogs)
  return authors.reduce(
    (max, author) =>
      authorBlogs[author] > max.blogs
        ? { author, blogs: authorBlogs[author] }
        : max,
    { author: 'Not found', blogs: -1 },
  )
}

const mostLikes = (blogs) => {
  const authorLikes = {}
  blogs.forEach((blog) => {
    const { author } = blog
    !authorLikes[author]
      ? (authorLikes[author] = blog.likes)
      : (authorLikes[author] += blog.likes)
  })

  const authors = Object.keys(authorLikes)
  return authors.reduce(
    (max, author) =>
      authorLikes[author] > max.likes
        ? { author, likes: authorLikes[author] }
        : max,
    { author: 'Not found', likes: -1 },
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
