'use strict'

class GameLogic {
  constructor (allowedGuesses) {
    this._allowedGuesses = allowedGuesses
    this._guessesLeft = allowedGuesses
  }

  checkLetterInWord (letter, word) {
    let letterInWord = false
    if (word.includes(letter)) {
      letterInWord = true
    }
    return letterInWord
  }

  checkWordComplete (word, hiddenWord) {
    let wordComplete = false

    if (word === hiddenWord) {
      wordComplete = true
    }
    return wordComplete
  }

  getAllowedGuesses () {
    return this._allowedGuesses
  }

  getGuessesLeft () {
    return this._guessesLeft
  }

  removeGuess () {
    this._guessesLeft--
  }

  checkGameOver () {
    let gameOver = false
    if (this._guessesLeft === 0) {
      gameOver = true
    }
    return gameOver
  }
}

module.exports = GameLogic
