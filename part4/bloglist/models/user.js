const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, minLength: 3, required: true, unique: true },
  name: String,
  passwordHash: { type: String, required: true },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret.passwordHash
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('User', userSchema)
