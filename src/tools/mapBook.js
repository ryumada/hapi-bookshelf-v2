module.exports = (books) => {
  const bookMapped = books.map((book) => {
    const {
      id, name, publisher
    } = book
    return {
      id, name, publisher
    }
  })

  return bookMapped
}
