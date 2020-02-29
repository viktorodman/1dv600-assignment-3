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
    this._events = {
      menu: 'menuitemchosen',
      gameExit: 'exittomenu',
      appExit: 'exitconfirmation'
    }

    this._menu = new Menu(['Play Game', 'Change Settings', 'Quit Game'], this._events.menu)
    this._gameIO = new GameIO()
  }

  /**
   * Starts the main menu.
   *
   * @memberof TerminalHangman
   */
  init () {
    this._menu.on(this._events.menu, (menuitem) => {
      this._menu.removeAllListeners(this._events.menu)

      switch (menuitem) {
        case 'Play Game': this._launchGame()
          break
        case 'Change Settings': this._settings()
          break
        case 'Quit Game': this._quitGame()
          break
      }
    })
    this._menu.listMenuItems()
  }

  /**
   * Create a new game.
   *
   * @memberof TerminalHangman
   */
  _launchGame () {
    const game = new Game(this._events.gameExit)

    game.on(this._events.gameExit, () => {
      this.init()
      game.removeAllListeners(this._events.gameExit)
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
      this._gameIO.removeAllListeners(this._exitEvent)
      if (confirmation) {
        process.exit(0)
      } else {
        this.init()
      }
    })
    this._gameIO.confirm('Are you sure you want to quit?', this._exitEvent)
  }
}

module.exports = TerminalHangman
