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
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handler.editBookByIdHandler
  }
]

module.exports = routes
