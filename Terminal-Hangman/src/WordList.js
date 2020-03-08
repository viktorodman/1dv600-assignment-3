'use strict'

const FileReader = require('./FileReader')

/**
 * Represets a WordList.
 *
 * @class WordList
 */
class WordList {
  /**
   * Creates an instance of WordList.
   *
   * @param {string} wordListDir Path to directory with word-lists.
   * @memberof WordList
   */
  constructor (wordListDir) {
    this._dirpath = wordListDir
    this._fileReader = new FileReader()
  }

  /**
   * Returns the available word-lists.
   *
   * @returns {Array} An array with objects containing the file path and the file name.
   * @memberof WordList
   */
  async getAvailableWordLists () {
    try {
      const wordListsInDir = await this._fileReader.getFilesInDir(this._dirpath)
      const stringifyFiles = await wordListsInDir.map(list => {
        return {
          filePath: `${this._dirpath}/${list}`,
          fileName: this._fileReader.fileToString(list)
        }
      })
      return stringifyFiles
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Gets the file of the passed file path.
   *
   * @param {string} filePath The path to a file.
   * @returns {Array} An array containing words.
   * @memberof WordList
   */
  async getWordList (filePath) {
    return this._fileReader.getJsonFile(filePath)
  }
}

module.exports = WordList
