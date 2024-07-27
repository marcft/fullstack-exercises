const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const blogsList = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
]

describe('totalLikes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const listWithOneBlog = [blogsList[0]]
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 7)
  })

  test('when list has many blogs, equals the sum of likes', () => {
    assert.strictEqual(listHelper.totalLikes(blogsList), 36)
  })

  test('when the list has any blogs, equals zero', () => {
    const listWithAnyBlogs = []
    assert.strictEqual(listHelper.totalLikes(listWithAnyBlogs), 0)
  })
})

describe('favoriteBlog', () => {
  test("when the list has one blog, that's the favorite", () => {
    const listWithOneBlog = [blogsList[0]]
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('when the list has many blogs, the first most liked is the favorite', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(blogsList), {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    })
  })

  test('when the list has any blogs, no blog is the favorite', () => {
    const listWithAnyBlogs = []
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithAnyBlogs), {
      title: 'Any blog found',
      author: 'None',
      likes: -1,
    })
  })
})

describe('mostBlogs', () => {
  test('when the list has one blog, it is that author', () => {
    const listWithOneBlog = [blogsList[0]]
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: 'Michael Chan',
      blogs: 1,
    })
  })

  test('when the list has many blogs, it is the author with more posts', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(blogsList), {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })

  test('when the list has any blogs, it is no author', () => {
    const listWithAnyBlogs = []
    assert.deepStrictEqual(listHelper.mostBlogs(listWithAnyBlogs), {
      author: 'Not found',
      blogs: -1,
    })
  })
})

describe('mostLikes', () => {
  test('when the list has one blog, it is that author', () => {
    const listWithOneBlog = [blogsList[0]]
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: 'Michael Chan',
      likes: 7,
    })
  })

  test('when the list has many blogs, it is the author with more likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(blogsList), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })

  test('when the list has any blogs, it is no author', () => {
    const listWithAnyBlogs = []
    assert.deepStrictEqual(listHelper.mostLikes(listWithAnyBlogs), {
      author: 'Not found',
      likes: -1,
    })
  })
})
