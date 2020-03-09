'use strict'

/**
 * Represent.
 *
 * @class Word
 */
class Word {
  /**
   * Creates an instance of Word.
   *
   * @memberof Word
   */
  constructor () {
    this._word = undefined
    this._hiddenWord = undefined
  }

  /**
   * Sets the word to a randomly picked word from the passed list.
   *
   * @param {Array} list An array of words.
   * @memberof Word
   */
  setRandomWord (list) {
    this._word = list[Math.floor(Math.random() * list.length)].toLowerCase()
  }

  setWord (word) {
    this._word = word
  }

  /**
   * Creates a hidden version of the word.
   *
   * @memberof Word
   */
  setHiddenWord () {
    const hiddenWord = [...this._word].map((character) => {
      if (character !== ' ') {
        character = '_'
      }
      return character
    })
    this._hiddenWord = hiddenWord.join('')
  }

  /**
   * Replaces the hidden version of the words letters that
   * is equal to the passed letter.
   *
   * @param {string} letter A letter.
   * @memberof Word
   */
  removeHiddenLetters (letter) {
    const hiddenLetters = [...this._hiddenWord].map((char, i) => {
      if (this._word.charAt(i) === letter) {
        char = this._word.charAt(i)
      }
      return char
    })
    this._hiddenWord = hiddenLetters.join('')
  }

  /**
   * Gets the current word.
   *
   * @returns {string} A word.
   * @memberof Word
   */
  getWord () {
    return this._word
  }

  /**
   * Gets the hidden version of the current word.
   *
   * @returns {string} A word.
   * @memberof Word
   */
  getHiddenWord () {
    return this._hiddenWord
  }
}

module.exports = Word
