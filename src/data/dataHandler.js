const fs = require('fs')
const path = require('path')

const settingsFile = fs.readFileSync(path.resolve(__dirname, '../../settings.json'))
const _fileLocation = path.resolve(__dirname, JSON.parse(settingsFile).fileLocation)

if (!fs.existsSync(_fileLocation)) {
  const emptyData = JSON.stringify([], null, 2)
  fs.writeFileSync(_fileLocation, emptyData, (e) => {
    if (e) throw e
  })
}

const data = JSON.parse(fs.readFileSync(_fileLocation))

const addData = (newData) => {
  data.push(newData)
  const stringNewData = JSON.stringify(data, null, 2)

  fs.writeFileSync(_fileLocation, stringNewData, (e) => {
    if (e) throw e
  })
}

module.exports = { _fileLocation, addData, data }
