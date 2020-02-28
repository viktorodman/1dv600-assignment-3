'use strict'

const Game = require('./Game')
const Menu = require('./Menu')
const GameIO = require('./GameIO')

/**
 * A TerminalHangman Game.
 *
 * @class TerminalHangman
 */
class TerminalHangman {
  /**
   * Creates an instance of TerminalHangman.
   *
   * @memberof TerminalHangman
   */
  constructor () {
    this._menu = new Menu()
    this._gameIO = new GameIO()
    this._exitEvent = 'exitconfirmation'
  }

  /**
   * Starts the main menu.
   *
   * @memberof TerminalHangman
   */
  init () {
    this._menu.on('menuitemchosen', (menuitem) => {
      console.clear()
      switch (menuitem) {
        case 'Play Game': this._launchGame()
          break
        case 'Change Settings': this._settings()
          break
        case 'Quit Game': this._quitGame()
          break
      }
      this._menu.removeAllListeners('menuitemchosen')
    })
    this._menu.listMenuItems()
  }

  /**
   * Create a new game.
   *
   * @memberof TerminalHangman
   */
  _launchGame () {
    const game = new Game()
    game.on('exittomenu', () => {
      this.init()
      game.removeAllListeners('exittomenu')
    })
    game.init()
  }

  /**
   * Opens a menu with settings.
   *
   * @memberof TerminalHangman
   */
  _settings () {
    console.log('SETTINGS')
  }

  /**
   * Prompts the user with a confirmation for quiting the game.
   *
   * @memberof TerminalHangman
   */
  _quitGame () {
    this._gameIO.on(this._exitEvent, (confirmation) => {
      console.clear()
      this._gameIO.removeAllListeners(this._exitEvent)
      if (confirmation) {
        process.exit(1)
      } else {
        this.init()
      }
    })
    this._gameIO.confirm('Are you sure you want to quit?', this._exitEvent)
  }
}

module.exports = TerminalHangman
