'use strict'

const FileReader = require('./FileReader')

class WordList {
  constructor (wordListDir) {
    this._dirpath = wordListDir
    this._fileReader = new FileReader()
    this._list = undefined
  }

  // getWordLists => listsInDirectory

  async getAvailableWordLists () {
    try {
      const wordListsInDir = await this._fileReader.getFilesInDir(this._dirpath)
      const stringifyFiles = await wordListsInDir.map(list => {
        return {
          filePath: `${this._dirpath}/${list}`,
          fileName: this._fileReader.stringifyFile(list)
        }
      })
      return stringifyFiles
    } catch (error) {
      console.error(error)
    }
  }

  async setWordList (filePath) {
    this._list = this._fileReader.getJsonFile(filePath)
  }

  getWordList () {
    return this._list
  }
}

module.exports = WordList
