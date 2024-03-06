#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import RSS from '../lib/diary.js';

yargs(hideBin(process.argv))
	.command({
		command: 'diary <account>',
		desc: 'Get the RSS feed by account name',
		handler: (argv) => {
			let rss = new RSS({account: argv.account});
			rss.run();
		}
	})
	.demandCommand()
	.help()
	.parse()
// let args = require('yargs')
	
	/*
.command({
	command: 'configure <key> [value]',
	aliases: ['config', 'cfg'],
	desc: 'Set a config variable',
	builder: (yargs) => yargs.default('value', 'true'),
	handler: (argv) => {
		console.log(`setting ${argv.key} to ${argv.value}`)
	}
})

exports.builder = (yargs) => {
	yargs.alias('a', 'account')
	.describe('a', 'Letterboxd account name')
	.demandOption('a', 'Account is required, exiting.')
	.wrap(null);
	
	return yargs;
}

exports.handler = (args) => {
	let RSS = require('../../lib/diary.js');
	let rss = new RSS(args);
	rss.run();
}*/