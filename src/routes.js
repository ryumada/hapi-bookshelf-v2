const routes = (handler) => [
  {
    method: 'POST',
    path: '/books',
    handler: handler.addBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handler.getBookByIdHandler
  }
]

module.exports = routes
