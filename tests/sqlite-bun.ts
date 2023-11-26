import { Database } from "bun:sqlite"
import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "./utilities/escape"
import { randomUUID } from "crypto"

const db = new Database("test-bun.db")

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
	db.query(`SELECT * FROM AUTHORS`)
	console.timeEnd("Select authors")
}

async function initSQL() {
	await db.exec("PRAGMA journal_mode = WAL;")

	await db
		.query(
			`
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
	);`
		)
		.run()
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())

	const query = db.query(
		`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
	)
	const queries = ids.map(id =>
		query.run({
			$id: id,
			$firstName: escape(faker.person.firstName()),
			$lastName: escape(faker.person.lastName()),
		})
	)
	await Promise.all(queries)

	// const queries = ids.map(
	// 	id =>
	// 		`INSERT INTO authors (id, first_name, last_name) VALUES ('${id}', '${escape(
	// 			faker.person.firstName()
	// 		)}', '${escape(faker.person.lastName())}');`
	// )
	// await Promise.all(queries.map(query => db.query(query).run()))

	// const authors = new Array(count)
	// 	.fill(0)
	// 	.map(
	// 		() =>
	// 			`('${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}')`
	// 	)
	// const query = `INSERT INTO AUTHORS(first_name, last_name) VALUES ${authors.join(",")}`
	// await db.query(query).run()

	return ids
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(id => {
			const query = `SELECT * FROM authors WHERE id = '${ids[0]}'`
			return db.query(query).run()
		})
	)
}
