'use strict'

class Player {
  constructor () {
    this._gussedLetters = []
  }

  setGussedLetters (letters) {
    this._gussedLetters = letters
  }

  addGuessedLetters (letter) {
    this._gussedLetters.push(letter)
  }

  getGuessedLetters () {
    return this._gussedLetters
  }
}

module.exports = Player
