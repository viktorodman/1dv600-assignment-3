'use strict'
/**
 * Represents a player.
 *
 * @class Player
 */
class Player {
  /**
   * Creates an instance of Player.
   *
   * @memberof Player
   */
  constructor () {
    this._gussedLetters = []
  }

  /**
   * Sets the guessed letters to passed letters.
   *
   * @param {Array} letters An array of letters.
   * @memberof Player
   */
  setGussedLetters (letters) {
    this._gussedLetters = letters
  }

  /**
   * Adds the passed letter to the guessedLetters array.
   *
   * @param {string} letter A letter.
   * @memberof Player
   */
  addGuessedLetters (letter) {
    this._gussedLetters.push(letter)
  }

  /**
   * Returns the guessed letters.
   *
   * @returns {Array} An array of the guessed letters.
   * @memberof Player
   */
  getGuessedLetters () {
    return this._gussedLetters
  }
}

module.exports = Player
