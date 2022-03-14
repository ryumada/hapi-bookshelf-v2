const Hapi = require('@hapi/hapi')
const bookshelf = require('./bookshelf')

const init = async () => {
  const server = Hapi.server({
    port: '5000',
    host: 'localhost'
  })

  server.route(bookshelf)

  await server.start()
  console.log(`Server is running at ${server.info.uri}`)
}

init()
