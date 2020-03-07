'use strict'

class Word {
  constructor () {
    this._word = undefined
    this._hiddenWord = undefined
  }

  setRandomWord (list) {
    this._word = list[Math.floor(Math.random() * list.length)].toLowerCase()
  }

  setHiddenWord () {
    const hiddenWord = [...this._word].map((character) => {
      if (character !== ' ') {
        character = '_'
      }
      return character
    })
    this._hiddenWord = hiddenWord.join('')
  }

  removeHiddenLetters (letter) {
    const hiddenLetters = [...this._hiddenWord].map((char, i) => {
      if (this._word.charAt(i) === letter) {
        char = this._word.charAt(i)
      }
      return char
    })
    this._hiddenWord = hiddenLetters.join('')
  }

  getWord () {
    return this._word
  }

  getHiddenWord () {
    return this._hiddenWord
  }
}

module.exports = Word
