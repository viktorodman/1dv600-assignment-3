'use strict'

class Word {
  constructor () {
    this._word = undefined
    this._hiddenWord = undefined
  }

  setRandomWord (list) {
    this._word = list[Math.floor(Math.random() * list.length)]
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
}

module.exports = Word
