const { nanoid } = require('nanoid')
const data = require('./data/books')

const Handler = require('./handler')
const handler = new Handler({ nanoid, data })

const routes = require('./routes')

const bookshelf = routes(handler)

module.exports = bookshelf
