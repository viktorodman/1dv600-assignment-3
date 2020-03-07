'use strict'
const fs = require('fs-extra')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)

class FileReader {
  constructor () {
    this._test = undefined
  }

  async getFilesInDir (dirPath) {
    try {
      if (!await fs.pathExists(dirPath)) {
        throw new Error('Directory does not exist')
      }

      return await readdir(dirPath)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  async getJsonFile (filePath) {
    try {
      if (!filePath.endsWith('.json')) {
        throw new Error('Files need to be in json format!')
      }
      return await fs.readJSON(filePath)
    } catch (error) {
      console.error(error)
    }
  }

  fileToString (file) {
    const removeFileExtensions = this.removeFileExtension(file)
    return this.replaceUnderscores(removeFileExtensions)
  }

  replaceUnderscores (word) {
    return word.replace('_', ' ')
  }

  removeFileExtension (fileName) {
    return fileName.slice(0, fileName.indexOf('.'))
  }
}

module.exports = FileReader
