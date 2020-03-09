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
   * @param {string} exitEvent The name of an event that exits to the start menu.
   * @param {number} allowedGuesses The allowed number of guesses.
   * @param {boolean} test If the game is tested.
   */
  constructor (exitEvent, allowedGuesses, test) {
    super()
    this._test = test
    this._wordListDirPath = './src/word-lists'
    this._gameIO = new GameIO()
    this._wordList = new WordList(this._wordListDirPath)
    this._word = new Word()
    this._gameLogic = new GameLogic(allowedGuesses)
    this._player = new Player()

    this._exitEvent = exitEvent
  }

  /**
   * Sets up a new game.
   *
   * @memberof Game
   */
  async setUpGame () {
    try {
      if (!this._test) {
        const wordListChoice = await this.chooseWordList()

        this._word.setRandomWord(wordListChoice)
        this._word.setHiddenWord()
        this._player.setGussedLetters([])
        this._gameLogic.resetGusses()

        this.playGame()
      } else {
        this._word.setWord('te')
        this._word.setHiddenWord()
        this._player.setGussedLetters([])
        this._gameLogic.resetGusses()

        this.playGame()
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Starts a new round of the game.
   *
   * @memberof Game
   */
  async playGame () {
    try {
      const guessedLetters = this._player.getGuessedLetters()
      const hiddenWord = this._word.getHiddenWord()
      const guessesLeft = this._gameLogic.getGuessesLeft()

      this._gameIO.updateGameboard(hiddenWord, guessedLetters, drawings[guessesLeft], this._word.getWord())
      const enteredLetter = await this._gameIO.enterLetter(guessedLetters)

      const gameState = this.checkGameState(enteredLetter.toLowerCase(), this._word.getWord())

      switch (gameState) {
        case 'Playing': this.playGame()
          break
        case 'Loss': this.gameOver('YOU LOSE')

          break
        case 'Win': this.gameOver('YOU WIN')

          break
        case 'Exit': this.exitToMenu()
      }
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Checks what the next state of the game should be.
   *
   * @param {string} letter The entered letter.
   * @param {string} word The selected word.
   * @returns {string} The next gameState.
   * @memberof Game
   */
  checkGameState (letter, word) {
    let gameState
    if (letter === '!quit') {
      return 'Exit'
    }
    this._player.addGuessedLetters(letter)

    if (this._gameLogic.checkLetterInWord(letter, word)) {
      this._word.removeHiddenLetters(letter)
      this._gameLogic.checkWordComplete(word, this._word.getHiddenWord()) ? gameState = 'Win' : gameState = 'Playing'
    } else {
      this._gameLogic.removeGuess()
      this._gameLogic.checkGameOver() ? gameState = 'Loss' : gameState = 'Playing'
    }
    return gameState
  }

  /**
   * Prompts the user to choose a word-list.
   *
   * @returns {string} The filepath of the choosen word-list.
   * @memberof Game
   */
  async chooseWordList () {
    try {
      const availableWordLists = await this._wordList.getAvailableWordLists()
      const chosenList = await this._gameIO.promptList('Choose a Word List', availableWordLists.map(list => list.fileName))

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
  async exitToMenu () {
    const exitConfirmation = await this._gameIO.promptConfirmation('Are you sure you want to exit?')

    if (exitConfirmation) {
      this.emit(this._exitEvent)
    } else {
      this.playGame()
    }
  }

  /**
   * Displays the result of the game and
   * prompts a confirmation for playing the game again.
   *
   * @param {string} message The result of the game.
   * @memberof Game
   */
  async gameOver (message) {
    this._gameIO.displayGameResults(message, (this._gameLogic.getWrongGuesses()), this._word.getWord())
    const playAgain = await this._gameIO.promptConfirmation('Play Again?')

    if (playAgain) {
      this.setUpGame()
    } else {
      this.emit(this._exitEvent)
    }
  }
}

module.exports = Game
