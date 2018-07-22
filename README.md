# OtakuQuotes

No longer in use: No longer up in production. Project hasn't been worked on in a long time. Sorry!

Website and REST API for Anime/Manga Quotes.

Recreated from Scratch using Python's Sanic Backend.

## Usage

### `GET /api/random`

GET a random anime quote.

### `GET /api/quotes`

GET a quote given some tag. Separated by spaces.

Example: `GET /api/quotes?tags=Kaiki%20Deishuu`

### `GET /api/quotes/:id`

GET a quote from an ID.

Example: `GET /api/quotes/1`

## Usage Limits

Currently, there are no usage limits as the product is not completed. In the future there may be usage limits w/
small payment options to keep the servers alive.

## (unofficial) Terms of Service

- Do not store large amounts of our data. You can keep some for caching purposes, but refrain from mass storage.
- Please refer to OtakuQuotes somewhere in your application when using this API.

## Development

WIP

## Screenshots

![Home](/screenshot1.jpg?raw=true)
![Submission](/screenshot2.jpg?raw=true)
