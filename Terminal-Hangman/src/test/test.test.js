const WordList = require('../WordList')
const wordList = new WordList()

test('Should replace underscores with spaces of the passed string', () => {
  expect(wordList.replaceUnderscores('hello_world')).toBe('hello world')
})

test('Should return a string', () => {
  expect(typeof wordList.replaceUnderscores('hello')).toBe('string')
})

test('Should return the length of the passed string', () => {
  expect(wordList.getWordLength('two+seven')).toBe(9)
})

test('Should return an integer when passed a string', () => {
  expect(typeof wordList.getWordLength('tjoho')).toBe('number')
})
