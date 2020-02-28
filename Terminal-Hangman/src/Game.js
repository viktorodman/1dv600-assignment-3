'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')

/**
 * Represents the game.
 *
 * @class Game
 * @augments {EvenEmitter}
 */
class Game extends EvenEmitter {
  /**
   * Creates an instance of Game.
   *
   * @memberof Game
   */
  constructor () {
    super()
    this._gameIO = new GameIO()
    this._wordLists = ['Word List 1', 'Word List 2']
    this._wordListEvent = 'wordlistchoice'
    this._playerChoices = ['Enter Letter', 'Exit To Menu']
    this._playerChoiceEvent = 'playerinput'
    this._exitToMenuEvent = 'exitmenuconfirm'
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  init () {
    this._gameIO.on(this._wordListEvent, (wordList) => {
      console.clear()
      // Generate Word From Word LIST
      this.startGame()
      this._gameIO.removeAllListeners(this._wordListEvent)
    })
    this._gameIO.listItems('Choose A Word List', 'wordlist', this._wordLists, this._wordListEvent)
  }

  /**
   * Asks the user to enter a letter or quit the game.
   *
   * @memberof Game
   */
  startGame () {
    this._gameIO.on(this._playerChoiceEvent, (playerChoice) => {
      console.clear()
      switch (playerChoice) {
        case 'Enter Letter': console.log('Will be added later')
          break
        case 'Exit To Menu' : this.exitToMenu()
      }
      this._gameIO.removeAllListeners(this._playerChoiceEvent)
    })
    this._gameIO.listItems('Player Input (CHANGE THIS)', 'playerchoice', this._playerChoices, this._playerChoiceEvent)
  }

  /**
   * Prompts a confirmation for exiting to the main menu.
   *
   * @memberof Game
   */
  exitToMenu () {
    this._gameIO.on(this._exitToMenuEvent, (confirmation) => {
      console.clear()
      if (confirmation) {
        this.emit('exittomenu')
      } else {
        this.startGame()
      }
      this._gameIO.removeAllListeners(this._exitToMenuEvent)
    })
    this._gameIO.confirm('Are you sure you want to exit?', this._exitToMenuEvent)
  }
}

module.exports = Game
