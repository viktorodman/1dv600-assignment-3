'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')
const WordList = require('./WordList')
const Word = require('./Word')
const GameLogic = require('./GameLogic')
const Player = require('./Player')
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
   * @param test
   */
  constructor (exitEvent, allowedGuesses, test) {
    super()
    /* this._wordList = new WordList('./src/word-lists') */
    this._test = test
    this._wordListDirPath = './src/word-lists'

    this._gameIO = new GameIO()
    this._wordList = new WordList(this._wordListDirPath)
    this._word = new Word()
    this._gameLogic = new GameLogic(allowedGuesses)
    this._player = new Player()

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

  async setUpGame () {
    try {
      const wordListChoice = await this.chooseWordList()

      this._word.setRandomWord(wordListChoice)
      this._word.setHiddenWord()
      this.playGame()
    } catch (error) {
      console.error(error)
    }
  }

  async playGame () {
    try {
      const guessedLetters = this._player.getGuessedLetters()
      const hiddenWord = this._word.getHiddenWord()
      const guessesLeft = this._gameLogic.getGuessesLeft()

      this._gameIO.updateGameboard(hiddenWord, guessedLetters, drawings[guessesLeft], this._word.getWord())
      const enteredLetter = await this._gameIO.enterLetter(guessedLetters)

      if (enteredLetter === '!quit') {
        console.log('quitGame')
      } else {
        const letter = enteredLetter.toLowerCase()
        this._player.addGuessedLetters(letter)
        this.checkLetter(letter, this._word.getWord())
      }
    } catch (error) {
      console.error(error)
    }
  }

  async chooseWordList () {
    try {
      const availableWordLists = await this._wordList.getAvailableWordLists()
      const chosenList = await this._gameIO.chooseWordList(availableWordLists.map(list => list.fileName))

      const chosenFile = availableWordLists.find(({ fileName }) => fileName === chosenList)
      return this._wordList.getWordList(chosenFile.filePath)
    } catch (error) {
      console.error(error)
    }
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

  checkLetter (letter, word) {
    if (this._gameLogic.checkLetterInWord(letter, word)) {
      this._word.removeHiddenLetters(letter)
      this._gameLogic.checkWordComplete(word, this._word.getHiddenWord()) ? this.gameOver('You Win :) !') : this.playGame()
    } else {
      this._gameLogic.removeGuess()
      this._gameLogic.checkGameOver() ? this.gameOver('You Lose :( !') : this.playGame()
    }
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
