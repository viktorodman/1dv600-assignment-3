'use strict'

const fs = require('fs-extra')
const { promisify } = require('util')

const readdir = promisify(fs.readdir)

class WordGenerator {
  constructor () {
    this._filePath = './src/word-lists'
    this._wordLists = undefined
  }

  async getWordLists () {
    try {
      this._wordLists = await readdir(this._filePath)

      return this.getFileNames(this._wordLists)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  async getWord (file) {
    try {
      const filename = file.replace(' ', '_')
      const listObject = await fs.readJSON(`${this._filePath}/${filename}.json`)

      return this.shuffleWordList(listObject)[0].toLowerCase()
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  getFileNames (lists) {
    return lists.map(list => {
      list = list.replace('.json', '')
      return list.replace('_', ' ')
    })
  }

  shuffleWordList (list) {
    const listCopy = [...list]
    let currentIndex = listCopy.length
    let temporaryValue = 0
    let randomIndex = 0

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = listCopy[currentIndex]
      listCopy[currentIndex] = listCopy[randomIndex]
      listCopy[randomIndex] = temporaryValue
    }
    return listCopy
  }

  createPlaceHolder (word) {
    const test = [...word].map((character) => {
      if (character !== ' ') {
        character = '_'
      }
      return character
    })
    return test.join('')
  }
}

module.exports = WordGenerator
