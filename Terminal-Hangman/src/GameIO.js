'use strict'
const EvenEmitter = require('events')
const inquirer = require('inquirer')

/**
 * Represnt the GameIO.
 *
 * @class GameIO
 * @augments {EvenEmitter}
 */
class GameIO extends EvenEmitter {
  /**
   * Creates an instance of GameIO.
   *
   * @memberof GameIO
   */
  constructor () {
    super()
    this._test = undefined
  }

  async promptQuestion (questionObject, event) {
    try {
      const answer = await inquirer.prompt([questionObject])
      console.clear()
      this.emit(event, answer)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  async chooseWordList (wordLists) {
    const questionObject = {
      type: 'list',
      message: 'Choose a Word List',
      name: 'wordlist',
      choices: wordLists,
      prefix: ''
    }
    const answer = await inquirer.prompt([questionObject])
    return answer[questionObject.name]
  }

  updateGameboard (placeholder, guessesedLetters, drawing) {
    console.log(`
Guessed Letters: ${guessesedLetters}
${drawing}
Placeholders: ${placeholder}
`)
  }

  displayGameResults (result, numOfguesses, word) {
    console.log(`
${result}
Wrong Guesses: ${numOfguesses}
Correct Word: ${word}
`)
  }

  async enterLetter () {
    const questionObject = {
      type: 'input',
      message: 'Enter a letter!',
      name: 'playerletter',
      prefix: '',
      suffix: '(Type !quit to exit to the menu)',
      guessedLetters: this._gameInfo.guessedLetters,
      validate: (value) => {
        if (questionObject.guessedLetters.includes(value)) {
          return 'Letter already used! Please enter a new letter'
        }
        if (value.length === 1 || value === '!quit') {
          return true
        }
        return 'Please enter a letter'
      }
    }

    const answer = await inquirer.prompt([questionObject])

    return answer
  }
}

module.exports = GameIO
