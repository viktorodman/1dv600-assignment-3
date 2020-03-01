'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')
const WordGenerator = require('./WordGenerator')

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
    this._wordGenerator = new WordGenerator()
    this._gameIO = new GameIO()
    this._events = {
      exit: exitEvent,
      wordList: 'wordlistchoice',
      playerChoice: 'playerinput',
      letter: 'letterEntered'
    }
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  async init () {
    // Generate Word From Word LIST
    const questionObject = {
      type: 'list',
      message: 'Choose a Word List',
      name: 'wordlist',
      choices: await this._wordGenerator.getWordLists(),
      prefix: ''
    }

    this._gameIO.on(this._events.wordList, async (wordList) => {
      this._gameIO.removeAllListeners(this._events.wordList)
      const randomWord = await this._wordGenerator.getWord(wordList[questionObject.name])
      console.log(randomWord)

      /* this.startGame() */
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
      choices: ['Enter Letter', 'Exit To Menu'],
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
      this._gameIO.removeAllListeners(this._events.letter)
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
    const questionObject = {
      type: 'confirm',
      name: 'confirmation',
      message: '',
      prefix: ''
    }

    this._gameIO.on(this._events.exit, (confirmation) => {
      if (confirmation[questionObject.name]) {
        this.emit('exittomenu')
      } else {
        this.startGame()
      }
      this._gameIO.removeAllListeners(this._events.exit)
    })
    this._gameIO.promptQuestion(questionObject, this._events.exit)
  }
}

module.exports = Game
