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

  updateGameboard (placeholder, guessesedLetters, drawing) {
    console.log(`
Guessed Letters: ${guessesedLetters}
${drawing}
Placeholders: ${placeholder}
`)
  }
}

module.exports = GameIO
