'use strict'
/**
 * Starting point of the application.
 *
 * @author Viktor Ödman
 * @version 1.0.0
 */

const TerminalHangman = require('./src/TerminalHangman')

const terminalHangman = new TerminalHangman(false)

terminalHangman.startMenu()
