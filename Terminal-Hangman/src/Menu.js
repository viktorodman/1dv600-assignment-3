'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')

/**
 * Represents a menu.
 *
 * @class Menu
 * @augments {EvenEmitter}
 */
class Menu extends EvenEmitter {
  /**
   * Creates an instance of Menu.
   *
   * @memberof Menu
   * @param {Array} menuItems - List of menu Items.
   * @param menuEvent
   */
  constructor (menuItems, menuEvent) {
    super()
    this._gameIO = new GameIO()
    this._menuItems = menuItems
    this._menuEvent = menuEvent
    this._menuChoiceEvent = 'menuchoice'
  }

  /**
   * Prompts a lists of the menu items.
   *
   * @memberof Menu
   */
  listMenuItems () {
    const questionObject = {
      type: 'list',
      message: 'Welcome To Terminal Hangman!',
      name: 'menuitem',
      choices: this._menuItems,
      prefix: ''
    }

    this._gameIO.on(this._menuChoiceEvent, (menuItem) => {
      this._gameIO.removeAllListeners(this._menuChoiceEvent)

      this.emit(this._menuEvent, menuItem[questionObject.name])
    })

    this._gameIO.promptQuestion(questionObject, this._menuChoiceEvent)
  }
}

module.exports = Menu
