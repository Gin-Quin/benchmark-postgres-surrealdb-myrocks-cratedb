import { Database } from "bun:sqlite"
import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "./utilities/escape"
import { randomUUID } from "crypto"

const db = new Database("test-bun.db", { create: true })

main()

async function main() {
	await initSQL()

	const count = 2048
	const stage = `Insert ${count} authors`
	console.time(stage)
	const ids = await insertauthors(count)
	console.timeEnd(stage)

	console.time("Pick authors")
	await pickauthors(ids)
	console.timeEnd("Pick authors")

	console.time("Select authors")
	db.query(`SELECT * FROM authors`).run()
	console.timeEnd("Select authors")
}

async function initSQL() {
	await db.exec("PRAGMA journal_mode = WAL;")

	await db.exec(`DROP TABLE IF EXISTS BOOKS;`)
	await db.exec(`DROP TABLE IF EXISTS authors;`)
	await db.exec(`CREATE TABLE authors
	(
		id text PRIMARY KEY, 
		first_name text,
		last_name text
	);`)
	await db.exec(
		`CREATE TABLE BOOKS
	(
		id text PRIMARY KEY,
		name text,
		author text REFERENCES authors(id),
		isnb text,
		price int
	);`
	)
}

const insertauthorsQuery = db.query(
	`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
)

async function insertauthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())

	const queries = ids.map(id =>
		insertauthorsQuery.run({
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
	// const query = `INSERT INTO authors(first_name, last_name) VALUES ${authors.join(",")}`
	// await db.query(query).run()

	return ids
}

const pickAuthorQuery = db.query(`SELECT * FROM authors WHERE id = $id`)

async function pickauthors(ids: string[]) {
	await Promise.all(ids.map($id => pickAuthorQuery.run({ $id })))
}
