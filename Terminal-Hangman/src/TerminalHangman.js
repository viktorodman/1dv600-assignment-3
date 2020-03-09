'use strict'

const Game = require('./Game')
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
   * @param {boolean} test True if the game should be started in test mode.
   */
  constructor (test) {
    this._test = test
    this._exitEvent = 'exitToMenu'
    this._menuItems = ['Play Game', 'Change Settings', 'Quit Game']

    this._gameIO = new GameIO()
    this._allowedGuesses = 8
  }

  /**
   * Starts the main menu.
   *
   * @memberof TerminalHangman
   */
  async startMenu () {
    if (this._test) {
      this.startTestSession()
    } else {
      const menuChoice = await this._gameIO.promptList('Game Menu', this._menuItems)

      switch (menuChoice) {
        case 'Play Game': this.startGame()
          break
        case 'Change Settings': this.showSettings()
          break
        case 'Quit Game': this.quitGame()
          break
      }
    }
  }

  /**
   * Start a new game.
   *
   * @memberof TerminalHangman
   */
  startGame () {
    const game = new Game(this._exitEvent, this._allowedGuesses, false)

    game.on(this._exitEvent, () => {
      this.startMenu()
      game.removeAllListeners(this._exitEvent)
    })

    game.setUpGame()
  }

  startTestSession () {
    const game = new Game(this._exitEvent, this._allowedGuesses, true)

    game.on(this._exitEvent, () => {
      process.exit(0)
    })

    game.setUpGame()
  }

  /**
   * Shows the game settings.
   *
   * @memberof TerminalHangman
   */
  showSettings () {
    console.log('SETTINGS')
  }

  /**
   * Prompts the user with a confirmation for quiting the game.
   *
   * @memberof TerminalHangman
   */
  async quitGame () {
    const exitConfirmation = await this._gameIO.promptConfirmation('Are you sure you want to quit?')

    if (exitConfirmation) {
      process.exit(0)
    } else {
      this.startMenu()
    }
  }
}

module.exports = TerminalHangman
