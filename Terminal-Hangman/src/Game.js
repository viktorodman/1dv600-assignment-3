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
   * @param allowedGuesses
   */
  constructor (exitEvent, allowedGuesses) {
    super()
    this._wordGenerator = new WordGenerator()
    this._gameIO = new GameIO()
    this._allowedGuesses = allowedGuesses
    this._events = {
      exit: exitEvent,
      wordList: 'wordlistchoice',
      playerChoice: 'playerinput',
      letter: 'letterEntered'
    }
    this._selectedWord = undefined
    this._gameStates = {
      playing: 'Playing',
      newGame: 'New Game',
      gameOver: 'Game Over'
    }
    this._currentState = 'New Game'
    this._gameInfo = {
      guessesLeft: undefined,
      guessedLetters: ['a', 'b'],
      selectedWord: undefined
    }
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  async playGame () {
    if (this._currentState === this._gameStates.newGame) {
      /* this._resetGame() */
    }
    const questionObject = {
      type: 'list',
      message: 'Choose a Word List',
      name: 'wordlist',
      choices: await this._wordGenerator.getWordLists(),
      prefix: ''
    }

    this._gameIO.on(this._events.wordList, async (wordList) => {
      this._gameIO.removeAllListeners(this._events.wordList)
      this._gameInfo.selectedWord = await this._wordGenerator.getWord(wordList[questionObject.name])

      this._enterLetter()
    })
    this._gameIO.promptQuestion(questionObject, this._events.wordList)
  }

  _enterLetter () {
    const questionObject = {
      type: 'input',
      message: 'Enter a letter!',
      name: 'playerletter',
      suffix: '(Type !quit to exit to the menu)',
      guessedLetters: this._gameInfo.guessedLetters,
      /* validate: (value) => (value.length === 1 || value === '!quit') ? true : 'Please enter a letter' */
      validate: (value) => {
        if (questionObject.guessedLetters.includes(value)) {
          return 'Letter already used! Please enter a new letter'
        }
        if (value.length === 1 || value === '!quit') {
          return true
        }
        return 'Please enter a letter'
      }
    }

    this._gameIO.on(this._events.letter, (letter) => {
      this._gameIO.removeAllListeners(this._events.letter)
      console.log(letter[questionObject.name])
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

  _resetGame () {
    this._gameInfo.guessesLeft = this._allowedGuesses
    this._gameInfo.guessedLetters = []
    this._currentState = this._gameStates.playing
  }

  _checkLetterInWord (letter) {

  }
}

module.exports = Game
