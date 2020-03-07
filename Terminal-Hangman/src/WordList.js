'use strict'

const FileReader = require('./FileReader')

class WordList {
  constructor (wordListDir) {
    this._dirpath = wordListDir
    this._fileReader = new FileReader()
  }

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

  async getWordList (filePath) {
    return this._fileReader.getJsonFile(filePath)
  }
}

module.exports = WordList
