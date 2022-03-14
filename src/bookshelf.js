const { nanoid } = require('nanoid')
const dataHandler = require('./data/dataHandler')

const Handler = require('./handler')
const handler = new Handler(dataHandler, nanoid)

const routes = require('./routes')

const bookshelf = routes(handler)

module.exports = bookshelf
