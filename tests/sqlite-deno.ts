import { DB } from "https://deno.land/x/sqlite/mod.ts"
import { fakerDE as faker } from "npm:@faker-js/faker"
import { randomUUID } from "node:crypto"
import { escape } from "./utilities/escape.ts"

// Open a database
const db = new DB("test-deno.db")
// db.executeute(`
//   CREATE TABLE IF NOT EXISTS people (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT
//   )
// `)

// // Run a simple query
// for (const name of ["Peter Parker", "Clark Kent", "Bruce Wayne"]) {
// 	db.query("INSERT INTO people (name) VALUES (?)", [name])
// }

// // Print out data in table
// for (const [name] of db.query("SELECT name FROM people")) {
// 	console.log(name)
// }

// // Close connection
// db.close()

main()

function main() {
	console.log("HEY ??")
	console.time("Hello")
	initSQL()
	console.timeEnd("Hello")
	console.log("ZAB")

	const count = 50
	const stage = `Insert ${count} authors`
	console.log("ZAB")
	console.time(stage)
	const ids = insertAuthors(count)
	console.log("ZAB")
	console.timeEnd(stage)
	console.log("ZOB")
	console.log("ZUB")

	console.time("Pick authors")
	pickAuthors(ids)
	console.timeEnd("Pick authors")

	console.time("Select authors")
	const authors = db.query(`SELECT * FROM AUTHORS`)
	console.log("authors", authors)
	console.timeEnd("Select authors")

	db.close()
}

function initSQL() {
	db.execute("PRAGMA journal_mode = WAL;")

	db.execute(`DROP TABLE IF EXISTS authors;`)
	db.execute(`CREATE TABLE authors
	(
		id text PRIMARY KEY, 
		first_name text,
		last_name text
	);`)
}

function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	ids.map(id =>
		db.query(`INSERT INTO authors (id, first_name, last_name) VALUES (?, ?, ?);`, [
			id,
			escape(faker.person.firstName()),
			escape(faker.person.lastName()),
		])
	)
	return ids

	// const authors = new Array(count)
	// 	.fill(0)
	// 	.map(
	// 		() =>
	// 			`('${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}')`
	// 	)
	// const query = `INSERT INTO AUTHORS(first_name, last_name) VALUES ${authors.join(",")}`
	// await db.query(query)
}

function pickAuthors(ids: string[]) {
	ids.map(id => {
		const query = `SELECT * FROM authors WHERE id = '${id}'`
		return db.query(query)
	})
}
