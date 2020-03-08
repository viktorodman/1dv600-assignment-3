'use strict'
const fs = require('fs-extra')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)

/**
 * Represents a FileReader.
 *
 * @class FileReader
 */
class FileReader {
  /**
   * Creates an instance of FileReader.
   *
   * @memberof FileReader
   */
  constructor () {
    this._test = undefined
  }

  /**
   * Gets files in the passed directory.
   * Throws an error if the directory does not exist.
   *
   * @param {string} dirPath A path to a directory.
   * @returns {Array} An array with the filenames in the directory.
   * @memberof FileReader
   */
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

  /**
   * Reads and converts the json file of the passed file path.
   *
   * Throws an error if the file does not exist.
   * Throws an error if the file is not a json file.
   *
   * @param {string} filePath The file path for the file.
   * @returns {Array} An array with the items in the json file.
   * @memberof FileReader
   */
  async getJsonFile (filePath) {
    try {
      if (!await fs.pathExists(filePath)) {
        throw new Error('Files does not exist')
      }
      if (!filePath.endsWith('.json')) {
        throw new Error('Files need to be in json format!')
      }
      return await fs.readJSON(filePath)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Removes the underscore and file extension from a file.
   *
   * @param {string} file A file.
   * @returns {string} The passed string without underscore and file extension.
   * @memberof FileReader
   */
  fileToString (file) {
    const fileName = file.slice(0, file.indexOf('.'))
    return fileName.word.replace('_', ' ')
  }
}

module.exports = FileReader
