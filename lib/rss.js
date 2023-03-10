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
		const filmStub = filmURIParts[5]
		const parentFolder = process.env.OUTPUT_DIR;
		const folderName = `./${parentFolder}/${filmStub}`; // this is always going to be the film path
		const posterImagePath = `/${parentFolder}/${filmStub}/${filmStub}.jpg`;
		const title = entry.film.title;
		const displayTitle = entry.film.title;
		const watchedDate = new Date(entry.date.watched);
		const releaseYear = entry.film.year;
		const imagePath = entry.film.image.large;
		const coverImageFileName = `${folderName}/${filmStub}.jpg`;
		const rewatch = entry.isRewatch;
		// const review = entry.review.replace("\n", "\n\n");
		const review = entry.review;
		
		// make the destination folder
		if (!fs.existsSync(parentFolder)) {
			await mkdir(parentFolder).catch((err) => {
				return console.error(err);
			});
		}

		const frontMatter = {
			'title': title,
			'display_title': displayTitle,
			'release_year': releaseYear, 
			'cover_image': posterImagePath,
			'watched_date': watchedDate,
			'date': watchedDate,
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
			console.log('Wrote file successfully!');
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
			letterboxd(this.args.account)
				.then((items) => {
					// for (var i = 0; i < 2; i++) {
					for (const film of items) {
						// const film = items[i];
						const markDownFilm = this.createFolderAndFile(film);
					}		
				})
				.catch((error) => console.log(error));
		} else {
			console.log('no account');
		}
	}
}

module.exports = RSS;