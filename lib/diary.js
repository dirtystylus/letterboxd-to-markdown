require('dotenv').config();
const letterboxd = require('letterboxd');
const { DateTime } = require('luxon');
const fs = require('fs');
const got = require('got');
const { mkdir, writeFile } = require('fs').promises;
const matter = require('gray-matter');

function RSS(args) {
	this.args = args;
	
	this.createFolderAndFile = async (entry) => {
		const filmURI = entry.uri;
		const filmURIParts = filmURI.split('/');
		const title = entry.film.title;
		const displayTitle = entry.film.title;
		const watchedDate = new Date(entry.date.watched);
		const publishedDate = new Date(entry.date.published);
		const filmStub = filmURIParts[5];
		const watchedDateFormatted = await this.readableDate(watchedDate);
		const filmFolder = `${filmStub}-${watchedDateFormatted}`;
		const parentFolder = process.env.OUTPUT_DIR;
		const folderName = `./${parentFolder}/${filmFolder}`; // this is always going to be the film path
		const posterImagePath = `/${parentFolder}/${filmFolder}/${filmStub}.jpg`;
		const releaseYear = entry.film.year;
		const imagePath = entry.film.image.large;
		const coverImageFileName = `${folderName}/${filmStub}.jpg`;
		const rewatch = entry.isRewatch;
		const review = entry.review;
		
		const frontMatter = {
			'title': title,
			'display_title': displayTitle,
			'release_year': releaseYear, 
			'cover_image': posterImagePath,
			'watched_date': watchedDate,
			'date': publishedDate,
			'rewatch': rewatch
		}

		const postContent = matter.stringify(review, frontMatter);

		if (!fs.existsSync(folderName)) {
			await mkdir(folderName).catch((err) => {
				return console.error(err);
			});
			writeFile(`${folderName}/index.md`, postContent).catch((err) => {
				return console.error(err);
			});
		}

		try {
			const body = await got(imagePath, { responseType: 'buffer', resolveBodyOnly: true });
			writeFile(coverImageFileName, body, 'binary');
		} catch (err) {
			if (err.response.statusCode === 404) {
				console.log('Got a 404, failed to write file!');
			} else {
				console.log(err);
			}
		}
	};
	
	this.run = async () => {
			
		if (this.args.account) {
			const parentFolder = process.env.OUTPUT_DIR;
			if (!fs.existsSync(parentFolder)) {
				await mkdir(parentFolder).catch((err) => {
					return console.error(err);
				});
			}
			letterboxd(this.args.account)
				.then((items) => {
					// for (var i = 0; i < 2; i++) { // use for testing
					for (const film of items) {
						// const film = items[i]; // use for testing
						const markDownFilm = this.createFolderAndFile(film);
					}		
				})
				.catch((error) => console.log(error));
		} else {
			console.log('no account');
		}
	}
	
	this.readableDate = async (dateObj) => {
			if (typeof dateObj === 'string') {
				return DateTime.fromISO(dateObj, { zone: "utc" }).toFormat(
					"yyyyMMdd"
				);
			} else {
				return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
					"yyyyMMdd"
				);
			}
	}
}

module.exports = RSS;