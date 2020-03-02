'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')
const WordGenerator = require('./WordGenerator')
const drawings = require('./drawings/hangmanDrawing')

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
      letter: 'letterEntered',
      playAgain: 'playagain'
    }
    this._gameInfo = {
      guessesLeft: undefined,
      guessedLetters: [],
      selectedWord: undefined,
      placeholder: undefined
    }
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  async playGame () {
    this._resetGame()
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
      this._gameInfo.placeholder = await this._wordGenerator.createPlaceHolder(this._gameInfo.selectedWord)

      this._enterLetter()
    })
    this._gameIO.promptQuestion(questionObject, this._events.wordList)
  }

  _enterLetter () {
    const questionObject = {
      type: 'input',
      message: 'Enter a letter!',
      name: 'playerletter',
      prefix: '',
      suffix: '(Type !quit to exit to the menu)',
      guessedLetters: this._gameInfo.guessedLetters,
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
    const { placeholder, guessedLetters, guessesLeft } = this._gameInfo

    this._gameIO.updateGameboard(placeholder, guessedLetters, drawings[guessesLeft])

    this._gameIO.on(this._events.letter, (playerInput) => {
      this._gameIO.removeAllListeners(this._events.letter)
      const input = playerInput[questionObject.name].toLowerCase()
      if (input === '!quit') {
        this.exitToMenu()
      } else {
        this._gameInfo.guessedLetters.push(input)
        this._checkLetterInWord(input)
      }
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
      message: 'Are you sure you want to quit?',
      prefix: ''
    }

    this._gameIO.on(this._events.exit, (confirmation) => {
      this._gameIO.removeAllListeners(this._events.exit)
      if (confirmation[questionObject.name]) {
        this.emit('exittomenu')
      } else {
        this._enterLetter()
      }
    })
    this._gameIO.promptQuestion(questionObject, this._events.exit)
  }

  _resetGame () {
    this._gameInfo.guessesLeft = this._allowedGuesses
    this._gameInfo.guessedLetters = []
  }

  _checkLetterInWord (letter) {
    if (this._gameInfo.selectedWord.includes(letter)) {
      this._gameInfo.placeholder = this._removePlaceholder(letter)

      this.checkWordComplete() ? this.gameOver('You win :)') : this._enterLetter()
    } else {
      this._gameInfo.guessesLeft--

      this.checkLose() ? this.gameOver('You lose :(') : this._enterLetter()
    }
  }

  _removePlaceholder (letter) {
    const placeholder = [...this._gameInfo.placeholder].map((char, i) => {
      if (this._gameInfo.selectedWord.charAt(i) === letter) {
        char = this._gameInfo.selectedWord.charAt(i)
      }
      return char
    })
    return placeholder.join('')
  }

  checkWordComplete () {
    let wordComplete = false
    const { selectedWord, placeholder } = this._gameInfo
    if (selectedWord === placeholder) {
      wordComplete = true
    }
    return wordComplete
  }

  checkLose () {
    let lose = false
    if (this._gameInfo.guessesLeft === 0) {
      lose = true
    }
    return lose
  }

  gameOver (message) {
    const questionObject = {
      type: 'confirm',
      name: 'playagain',
      message: 'Play Again?',
      prefix: ''
    }
    this._gameIO.displayGameResults(message, (this._allowedGuesses - this._gameInfo.guessesLeft), this._gameInfo.selectedWord)
    this._gameIO.on(this._events.playAgain, (confirmation) => {
      this._gameIO.removeAllListeners(this._events.playAgain)
      if (confirmation[questionObject.name]) {
        this.playGame()
      } else {
        this.emit('exittomenu')
      }
    })
    this._gameIO.promptQuestion(questionObject, this._events.playAgain)
  }
}

module.exports = Game
