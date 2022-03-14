const ClientError = require('./errors/clientError')
const NotFoundError = require('./errors/notFoundError')
const mapBook = require('./tools/mapBook')

class Handler {
  constructor ({ nanoid, data }) {
    this.nanoid = nanoid
    this.data = data

    this.addBookHandler = this.addBookHandler.bind(this)
    this.getBooksHandler = this.getBooksHandler.bind(this)
    this.getBookByIdHandler = this.getBookByIdHandler.bind(this)
    this.editBookByIdHandler = this.editBookByIdHandler.bind(this)
    this.deleteBookByIdHandler = this.deleteBookByIdHandler.bind(this)
  }

  addBookHandler (request, h) {
    try {
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading
      } = request.payload

      if (!name) throw new ClientError('NO_NAME_PROPERTY')
      if (readPage > pageCount) throw new ClientError('READ_PAGE_CANNOT_MORE_THAN_PAGE_COUNT')

      const id = this.nanoid(16)
      const finished = (pageCount === readPage)
      const insertedAt = new Date().toISOString()
      const updatedAt = insertedAt

      const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
      }

      this.data.push(newBook)

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id
        }
      })
      response.code(201)

      return response
    } catch (error) {
      if (error.message === 'NO_NAME_PROPERTY') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(error.code)

        return response
      }

      if (error.message === 'READ_PAGE_CANNOT_MORE_THAN_PAGE_COUNT') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(error.code)

        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error.name)

      return response
    }
  }

  getBooksHandler (request, h) {
    try {
      const { reading } = request.query

      if (reading !== undefined) {
        const isReading = Boolean(Number(reading))

        const books = this.data.filter((book) => book.reading === isReading)

        if (!books) throw new NotFoundError('BOOK_NOT_FOUND')

        return {
          status: 'success',
          data: {
            books: mapBook(books)
          }
        }
      }

      /* ----------------------------- take all books ----------------------------- */
      return {
        status: 'success',
        data: {
          books: mapBook(this.data)
        }
      }
    } catch (error) {
      if (error.message === 'BOOK_NOT_FOUND') {
        const response = h.response({
          status: 'fail',
          message: 'Tidak ditemukan Buku yang sedang dibaca'
        })
        response.code(error.code)

        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)

      return response
    }
  }

  getBookByIdHandler (request, h) {
    try {
      const { bookId } = request.params
      const book = this.data.filter((bookAttrib) => (bookAttrib.id === bookId))[0]

      if (!book) throw new NotFoundError('BOOK_NOT_FOUND')

      return {
        status: 'success',
        data: {
          book: book
        }
      }
    } catch (error) {
      if (error.message === 'BOOK_NOT_FOUND') {
        const response = h.response({
          status: 'fail',
          message: 'Buku tidak ditemukan'
        })
        response.code(error.code)

        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error.name)

      return response
    }
  }

  editBookByIdHandler (request, h) {
    try {
      const { bookId } = request.params
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading
      } = request.payload

      if (!name) throw new ClientError('NO_NAME_PROPERTY')
      if (readPage > pageCount) throw new ClientError('READ_PAGE_CANNOT_MORE_THAN_PAGE_COUNT')

      const foundBookIndex = this.data.findIndex((book) => book.id === bookId)
      if (foundBookIndex === -1) throw new NotFoundError('BOOK_NOT_FOUND')

      this.data[foundBookIndex] = {
        ...this.data[foundBookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toDateString()
      }

      return {
        status: 'success',
        message: 'Buku berhasil diperbarui'
      }
    } catch (error) {
      if (error.message === 'NO_NAME_PROPERTY') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(error.code)

        return response
      }

      if (error.message === 'READ_PAGE_CANNOT_MORE_THAN_PAGE_COUNT') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(error.code)

        return response
      }

      if (error.message === 'BOOK_NOT_FOUND') {
        const response = h.response({
          status: 'fail',
          message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        response.code(error.code)

        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error.name)

      return response
    }
  }

  deleteBookByIdHandler (request, h) {
    try {
      const { bookId } = request.params

      const foundBookIndex = this.data.findIndex((book) => book.id === bookId)
      if (foundBookIndex === -1) throw new NotFoundError('BOOK_NOT_FOUND')

      this.data.splice(foundBookIndex, 1)

      return {
        status: 'success',
        message: 'Buku berhasil dihapus'
      }
    } catch (error) {
      if (error.message === 'BOOK_NOT_FOUND') {
        const response = h.response({
          status: 'fail',
          message: 'Buku gagal dihapus. Id tidak ditemukan'
        })
        response.code(error.code)

        return response
      }

      const response = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami'
      })
      response.code(500)
      console.log(error)

      return response
    }
  }
}

module.exports = Handler
