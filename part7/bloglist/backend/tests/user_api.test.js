const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')

const helper = require('./test_helper')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

describe('users API with initial users', () => {
  beforeEach(async () => {
    await User.deleteMany()

    for (const user of helper.initialUsers) {
      await api.post('/api/users').send(user).expect(201)
    }
  })

  describe('no invalid users created', () => {
    test('not unique username', async () => {
      const notUniqueUser = {
        username: 'root',
        password: 'silence',
      }
      const response = await api
        .post('/api/users')
        .send(notUniqueUser)
        .expect(400)

      assert.strictEqual(
        response.body.error,
        'expected `username` to be unique',
      )

      const currentUsers = await helper.getUsersFromDB()
      assert.strictEqual(currentUsers.length, helper.initialUsers.length)
    })

    test('username missing or password missing', async () => {
      const notUsernameUser = {
        password: 'no-username',
      }
      const notPasswordUser = {
        username: 'no-pass',
      }
      await api.post('/api/users').send(notUsernameUser).expect(400)
      await api.post('/api/users').send(notPasswordUser).expect(400)

      const currentUsers = await helper.getUsersFromDB()
      assert.strictEqual(currentUsers.length, helper.initialUsers.length)
    })

    test('username or password with less than 3 characters', async () => {
      const invalidUsernameUser = {
        username: 'u',
        password: 'silence',
      }
      const invalidPasswordUser = {
        username: 'random',
        password: 'p',
      }
      await api.post('/api/users').send(invalidUsernameUser).expect(400)
      await api.post('/api/users').send(invalidPasswordUser).expect(400)

      const currentUsers = await helper.getUsersFromDB()
      assert.strictEqual(currentUsers.length, helper.initialUsers.length)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
