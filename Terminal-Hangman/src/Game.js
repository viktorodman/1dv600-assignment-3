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
   * @param exitEvent
   */
  constructor (exitEvent) {
    super()
    this._gameIO = new GameIO()
    this._events = {
      exit: exitEvent,
      wordList: 'wordlistchoice',
      playerChoice: 'playerinput',
      letter: 'letterEntered'
    }

    this._wordLists = ['Word List 1', 'Word List 2']
    this._playerAlt = ['Enter Letter', 'Exit To Menu']
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  init () {
    // Generate Word From Word LIST
    const questionObject = {
      type: 'list',
      message: 'Choose a Word List',
      name: 'wordlist',
      choices: this._wordLists,
      prefix: ''
    }

    this._gameIO.on(this._events.wordList, (wordList) => {
      this.startGame()
      this._gameIO.removeAllListeners(this._events.wordList)
    })
    this._gameIO.promptQuestion(questionObject, this._events.wordList)
  }

  /**
   * Asks the user to enter a letter or quit the game.
   *
   * @memberof Game
   */
  startGame () {
    const questionObject = {
      type: 'list',
      message: 'Alternatives',
      name: 'alternativ',
      choices: this._playerAlt,
      prefix: ''
    }

    this._gameIO.on(this._events.playerChoice, (playerChoice) => {
      switch (playerChoice[questionObject.name]) {
        case 'Enter Letter': this._enterLetter()
          break
        case 'Exit To Menu' : this.exitToMenu()
      }
      this._gameIO.removeAllListeners(this._events.playerChoice)
    })
    this._gameIO.promptQuestion(questionObject, this._events.playerChoice)
  }

  _enterLetter () {
    const questionObject = {
      type: 'input',
      message: 'Enter a Letter',
      name: 'playerletter',
      validate: (value) => value.length === 1 ? true : 'Please enter a letter'
    }

    this._gameIO.on(this._events.letter, (letter) => {
      console.log(letter)
    })
    this._gameIO.promptQuestion(questionObject, this._events.letter)
  }

  /**
   * Prompts a confirmation for exiting to the main menu.
   *
   * @memberof Game
   */
  exitToMenu () {
    this._gameIO.on(this._exitToMenuEvent, (confirmation) => {
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
