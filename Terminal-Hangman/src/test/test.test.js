const FileReader = require('../FileReader')
const fileReader = new FileReader()

// Test for the getFilesInDir method in the FileReader Class
test('Should throw an error with the message "Directory does not exist"', async () => {
  await expect(fileReader.getFilesInDir('./src/fake-directory')).rejects.toThrowError(new Error('Directory does not exist'))
})

test('Should return the files in the passed dir', async () => {
  await expect(fileReader.getFilesInDir('./src/test-folder')).resolves.toEqual(expect.arrayContaining(['1.json', '2.json']))
})

// Test for the getJsonFile method in the FileReader Class
test('Should throw an error with the message "Files does not exist"', async () => {
  await expect(fileReader.getJsonFile('./src/word-lists/notafile.json')).rejects.toThrowError(new Error('Files does not exist'))
})

test('Should throw an error with the message "Files needs to be in json format!"', async () => {
  await expect(fileReader.getJsonFile('./src/test-folder/notafile.txt')).rejects.toThrowError(new Error('Files needs to be in json format!'))
})
