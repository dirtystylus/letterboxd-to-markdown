#!/usr/bin/env node
let args = require('yargs')
	.commandDir('commands')
	.demandCommand()
	.help()
	.epilog('copyright 2023')
	.argv