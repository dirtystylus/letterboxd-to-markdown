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