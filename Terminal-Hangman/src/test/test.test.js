/* eslint-disable no-undef */
const FileReader = require('../FileReader')
const GameLogic = require('../GameLogic')

// Test for the getFilesInDir method in the FileReader Class

it('Should throw an exception', async () => {
  const sut = new FileReader()
  const input = './src/fake-directory'

  await expect(sut.getFilesInDir(input)).rejects.toThrow()
})

it('Should return the array ["1.json", "2.json", "notafile.txt"]', async () => {
  const sut = new FileReader()
  const input = './src/test-folder'
  const expectedResult = ['1.json', '2.json', 'notafile.txt']

  await expect(sut.getFilesInDir(input)).resolves.toEqual(expectedResult)
})

// Test for the getJsonFile method in the FileReader Class
it('Should throw an exception', async () => {
  const sut = new FileReader()
  const input = './src/word-lists/notafile.json'

  await expect(sut.getJsonFile(input)).rejects.toThrow()
})

it('Should throw an exception', async () => {
  const sut = new FileReader()
  const input = './src/test-folder/notafile.txt'

  await expect(sut.getJsonFile(input)).rejects.toThrow()
})

it('Should return the object "{ one: test1, two: test2 }"', async () => {
  const sut = new FileReader()
  const input = './src/test-folder/1.json'
  const expectedResult = { one: 'test1', two: 'test2' }

  await expect(sut.getJsonFile(input)).resolves.toEqual(expectedResult)
})

// Failing test for GameLogic

it('Should return true', () => {
  const sut = new GameLogic()
  const input1 = 'test'
  const input2 = 'test'
  const expectedResult = true

  expect(sut.checkWordComplete(input1, input2)).toBe(expectedResult)
})
