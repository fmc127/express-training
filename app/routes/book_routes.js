// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Example = require('../models/example')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET /books

router.get('/books', requireToken, (request, response, next) => {
  Book.find()
    .then(books => {
      return books.map(book => book.toObject())
    })
    .then(books => response.status(200).json({ books }))
    .catch(next)
})

// SHOW
// GET
router.get('/books/:id', requireToken, (req, res, next) => {
  Book.findById(req.params.id)
    .then(handle404)
    .then(book => res.status(200).json({ book: book.toObject() }))
    .catch(next)
})

// UPDATE
// PATCH

router.patch('/books/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.book.requireOwnership

  Book.findById(req.params.id)
    .then(handle404)
    .then(book => {
      requireOwnership(req, book)
      return book.updateOne(req.body.book)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})
