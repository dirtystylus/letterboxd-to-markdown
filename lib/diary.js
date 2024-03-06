import 'dotenv/config';
import letterboxd from 'letterboxd';
import { DateTime } from 'luxon';
import * as fs from 'fs';
import got from 'got';
import { promises as fspromises } from 'fs';
import matter from 'gray-matter';

export default class RSS {
	constructor(args) {
		this.args = args;
	}

	createFolderAndFile = async (entry) => {
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
			await fspromises.mkdir(folderName).catch((err) => {
				return console.error(err);
			});
			await fspromises.writeFile(`${folderName}/index.md`, postContent).catch((err) => {
				return console.error(err);
			});
		

			try {
				const body = await got(imagePath, { responseType: 'buffer', resolveBodyOnly: true });
				await fspromises.writeFile(coverImageFileName, body, 'binary');
			} catch (err) {
				if (err.response.statusCode === 404) {
					console.log('Got a 404, failed to write file!');
				} else {
					console.log(err);
				}
			}
		}
	};
	
	run = async () => {
		if (this.args.account) {
			const parentFolder = process.env.OUTPUT_DIR;
			if (!fs.existsSync(parentFolder)) {
				await fspromises.mkdir(parentFolder).catch((err) => {
					return console.error(err);
				});
			}
			letterboxd(this.args.account, "markdown")
				.then((items) => {
					// console.log(items);
					
					// for (var i = 3; i < 4; i++) { // use for testing
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
	
	readableDate = async (dateObj) => {
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