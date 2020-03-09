'use strict'
/**
 * Starting point of the application.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

const TerminalHangman = require('./src/TerminalHangman')
let startValue = false

if (process.argv[2] === 'test') {
  startValue = true
}

const terminalHangman = new TerminalHangman(startValue)

terminalHangman.startMenu()
