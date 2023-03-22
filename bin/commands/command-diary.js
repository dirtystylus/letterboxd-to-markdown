exports.command = 'diary';
exports.desc = 'Create markdown files from RSS';
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
}