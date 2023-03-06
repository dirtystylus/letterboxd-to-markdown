This project will read the RSS feed of a Letterboxd user and create local Markdown files from the user’s Letterboxd diary. This is most useful for creating a local archive of your Letterboxd account (I use it for publishing my film log to my Eleventy-based website).

This uses a [fork](https://github.com/dirtystylus/letterboxd) of the v2 release of the npm module [letterboxd](https://www.npmjs.com/package/letterboxd)

## Usage

1. Run `npm install`.
2. Copy **`.env.example`** to `.env` and set `OUTPUT_DIR` to be your desired output folder
3. Run `npm i -g` to install the `letterboxd` command globally
4. Run `letterboxd rss -a [account name]` with the letterboxd account name that you want to convert to Markdown

