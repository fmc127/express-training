const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  original_language: {
    type: String,
    required: true
  },
  first_published: {
    type: Number,
    required: true,
    min: 0,
    max: 3000
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  // automatically generates timestamps
  // virtuals allow us to alter the object
}, { timestamps: true, toJSON: { virtuals: true } })

bookSchema.virtual('introduction').get(function () {
  return `${this.title} by ${this.author} published on ${this.first_published}`
})

const model = mongoose.model('Book', bookSchema)

module.exports = model
