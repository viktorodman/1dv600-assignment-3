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
    this._questionList = {
      type: 'list',
      message: '',
      name: '',
      choices: [],
      prefix: ''
    }
    this._confirmList = {
      type: 'confirm',
      name: 'confirmation',
      message: '',
      prefix: ''
    }
  }

  /**
   * Prompts the user to confirm a question.
   *
   * @param {string} message A question.
   * @param {string} event The name of an event.
   * @memberof GameIO
   */
  async confirm (message, event) {
    try {
      this._confirmList.message = message

      const answer = await inquirer.prompt([this._confirmList])
      this.emit(event, answer.confirmation)
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }

  /**
   * Prompts a question and lists alternatives.
   *
   * @param {string} message A question.
   * @param {string} name A name to the question.
   * @param {Array} choices The list items.
   * @param {string} event A name of an event.
   * @memberof GameIO
   */
  async listItems (message, name, choices, event) {
    try {
      this._questionList.message = message
      this._questionList.name = name
      this._questionList.choices = choices

      const answer = await inquirer.prompt([this._questionList])
      this.emit(event, answer[name])
    } catch (error) {
      console.error(error)
      process.exit(1)
    }
  }
}

module.exports = GameIO
