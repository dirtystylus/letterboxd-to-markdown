exports.command = 'rss';
exports.desc = 'Create markdown files from RSS';
exports.builder = (yargs) => {
	yargs.alias('a', 'account')
	.describe('a', 'Letterboxd account name')
	.demandOption('a', 'Account is required, exiting.')
	.wrap(null);
	
	return yargs;
}

exports.handler = (args) => {
	let RSS = require('../../lib/rss.js');
	let rss = new RSS(args);
	rss.run();
}