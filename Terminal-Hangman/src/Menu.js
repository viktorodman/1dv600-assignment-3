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
   */
  constructor () {
    super()
    this._gameIO = new GameIO()
    this._menuItems = ['Play Game', 'Change Settings', 'Quit Game']
    this._menuEvent = 'menuchoice'
  }

  /**
   * Prompts a lists of the menu items.
   *
   * @memberof Menu
   */
  listMenuItems () {
    this._gameIO.on(this._menuEvent, (menuItem) => {
      console.clear()
      this._gameIO.removeAllListeners(this._menuEvent)
      this.emit('menuitemchosen', menuItem)
    })
    this._gameIO.listItems('Welcome To Terminal Hangman!', 'menuitem', this._menuItems, this._menuEvent)
  }
}

module.exports = Menu
