'use strict'
const inquirer = require('inquirer')

/**
 * Represents the Games IO.
 *
 * @class GameIO
 */
class GameIO {
  /**
   * Creates an instance of GameIO.
   *
   * @memberof GameIO
   */
  constructor () {
    this._test = undefined
  }

  /**
   * Prompts a list of items.
   *
   * @param {string} message A question.
   * @param {Array} choices An array of list items.
   * @returns {string} A string of the selected item.
   * @memberof GameIO
   */
  async promptList (message, choices) {
    const questionObject = {
      type: 'list',
      message: message,
      name: 'listItem',
      choices: choices,
      prefix: ''
    }
    const answer = await inquirer.prompt([questionObject])
    console.clear()
    return answer[questionObject.name]
  }

  /**
   * Prompts for confirmation for a question.
   *
   * @param {string} message A question.
   * @returns {boolean} True or false.
   * @memberof GameIO
   */
  async promptConfirmation (message) {
    try {
      const questionObject = {
        type: 'confirm',
        name: 'confirmation',
        message: message,
        prefix: ''
      }
      const answer = await inquirer.prompt([questionObject])
      console.clear()
      return answer[questionObject.name]
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Prompts for the input of a letter.
   * Also validates the input.
   *
   * @param {Array} guessedLetters The previous entered letters.
   * @returns {string} The entered letter.
   * @memberof GameIO
   */
  async enterLetter (guessedLetters) {
    const questionObject = {
      type: 'input',
      message: 'Enter a letter!',
      name: 'playerletter',
      prefix: '',
      suffix: '(Type !quit to exit to the menu)',
      guessedLetters: guessedLetters,
      validate: (value) => {
        if (questionObject.guessedLetters.includes(value.toLowerCase())) {
          return 'Letter already used! Please enter a new letter'
        }
        if (value.length === 1 || value === '!quit') {
          return true
        }
        return 'Please enter a letter'
      }
    }
    const answer = await inquirer.prompt([questionObject])
    console.clear()
    return answer[questionObject.name]
  }

  /**
   * Updates the current result of the game.
   *
   *
   * @param {string} hiddenWord The hidden version of the word.
   * @param {Array} guessesedLetters The guessed letters.
   * @param {string} drawing The current drawing of the gallows pole.
   * @memberof GameIO
   */
  updateGameboard (hiddenWord, guessesedLetters, drawing) {
    console.log(`
Guessed Letters: ${guessesedLetters}
${drawing}
Placeholders: ${hiddenWord}
`)
  }

  /**
   * Displays the result of the game.
   *
   * @param {string} result The result of the game.
   * @param {number} numOfguesses The number of guesses used in the game.
   * @param {string} word The correct word of the game.
   * @memberof GameIO
   */
  displayGameResults (result, numOfguesses, word) {
    console.log(`
${result}
Wrong Guesses: ${numOfguesses}
Correct Word: ${word}
`)
  }
}

module.exports = GameIO
