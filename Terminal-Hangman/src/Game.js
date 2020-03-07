'use strict'

const GameIO = require('./GameIO')
const EvenEmitter = require('events')
const WordList = require('./WordList')
const Word = require('./Word')
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
    /* this._wordList = new WordList('./src/word-lists') */
    this._wordListDirPath = './src/word-lists'
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

  async setUpGame () {
    const word = new Word()

    const wordListChoice = await this.chooseWordList()
    word.setRandomWord(wordListChoice)
    word.setHiddenWord()

    console.log(test)

    /* this.playGame(randomWordFromList) */
  }

  async playGame (word) {

  }

  async chooseWordList () {
    try {
      const wordList = new WordList(this._wordListDirPath)

      const availableWordLists = await wordList.getAvailableWordLists()
      const chosenList = await this._gameIO.chooseWordList(availableWordLists.map(list => list.fileName))
      const chosenFile = availableWordLists.find(({ fileName }) => fileName === chosenList)

      return wordList.getWordList(chosenFile.filePath)
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Starts a new game and asks the user
   * to choose a word-theme.
   *
   * @memberof Game
   */
  /* async playGame () {
    this._resetGame()
    const questionObject = {
      type: 'list',
      message: 'Choose a Word List',
      name: 'wordlist',
      choices: await this._wordList.getWordLists(),
      prefix: ''
    }

    this._gameIO.on(this._events.wordList, async (wordList) => {
      this._gameIO.removeAllListeners(this._events.wordList)
      this._gameInfo.selectedWord = await this._wordList.getWord(wordList[questionObject.name])
      this._gameInfo.placeholder = await this._wordList.createPlaceHolder(this._gameInfo.selectedWord)

      this._enterLetter()
    })
    this._gameIO.promptQuestion(questionObject, this._events.wordList)
  }

  async _enterLetter () {
    const enteredLetter = await this._gameIO.enterLetter()
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
 */
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

      this.checkLose(this._gameInfo.guessesLeft) ? this.gameOver('You lose :(') : this._enterLetter()
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

  checkLose (guessesLeft) {
    let lose = false
    if (guessesLeft === 0) {
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
