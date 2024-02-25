import { fakerDE as faker } from "@faker-js/faker"
import { randomUUID } from "crypto"
import { escape } from "./utilities/escape"

import SQLite from "better-sqlite3"
const db = new SQLite("test.db")

main()

async function main() {
	await initSQL()

	const count = 2048
	const stage = `Insert ${count} authors`
	console.time(stage)
	const ids = await insertAuthors(count)
	console.timeEnd(stage)

	console.time("Pick authors")
	await pickAuthors(ids)
	console.timeEnd("Pick authors")

	console.time("Select authors")
	db.exec(`SELECT * FROM AUTHORS`)
	console.timeEnd("Select authors")
}

async function initSQL() {
	db.pragma("journal_mode = WAL")

	db.exec(`
	DROP TABLE IF EXISTS BOOKS;
	DROP TABLE IF EXISTS AUTHORS;

	CREATE TABLE AUTHORS
	(
		id text PRIMARY KEY, 
		first_name text,
		last_name text
	);
	
	CREATE TABLE BOOKS
	(
		id text PRIMARY KEY,
		name text,
		author text REFERENCES AUTHORS(id),
		isnb text,
		price int
	);`)
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())

	const query = db.prepare(
		`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
	)
	const queries = ids.map(id =>
		query.run({
			id: id,
			firstName: escape(faker.person.firstName()),
			lastName: escape(faker.person.lastName()),
		})
	)
	await Promise.all(queries)

	// const queries = ids.map(
	// 	id =>
	// 		`INSERT INTO authors (id, first_name, last_name) VALUES ('${id}', '${escape(
	// 			faker.person.firstName()
	// 		)}', '${escape(faker.person.lastName())}');`
	// )
	// queries.map(query => db.prepare(query).run())

	// const authors = new Array(count).fill(0).map(() => `('${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}')`)
	// const query = `INSERT INTO AUTHORS(first_name, last_name) VALUES ${authors.join(',')}`
	// await sql.unsafe(query)

	return ids
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(id => {
			const query = `SELECT * FROM authors WHERE id = '${id}'`
			return db.exec(query)
		})
	)
}
