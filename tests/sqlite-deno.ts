import { DB } from "https://deno.land/x/sqlite@v3.7.0/mod.ts"
import { fakerDE as faker } from "npm:@faker-js/faker"
import { randomUUID } from "node:crypto"

const escape = (value: string) => value.replace(/'/g, "\\'")

// Open a database to be held in memory
const db = new DB("test-deno") // or new DB()
// Use new DB("file.db"); for a file-based database

db.execute(`
  CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )`)

main()

async function main() {
	console.log("HEY ??")
	console.time("Hello")
	await initSQL()
	console.timeEnd("Hello")
	console.log("ZAB")

	const count = 2048
	const stage = `Insert ${count} authors`
	console.log("ZAB")
	console.time(stage)
	const ids = await insertAuthors(count)
	console.log("ZAB")
	console.timeEnd(stage)
	console.log("ZOB")
	console.log("ZUB")

	console.time("Pick authors")
	await pickAuthors(ids)
	console.timeEnd("Pick authors")

	console.time("Select authors")
	db.query(`SELECT * FROM AUTHORS`)
	console.timeEnd("Select authors")

	db.close()
}

async function initSQL() {
	await db.execute("PRAGMA journal_mode = WAL;")

	await db.execute(
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
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const queries = ids.map(
		id =>
			`INSERT INTO authors (id, first_name, last_name) VALUES ('${id}', '${escape(
				faker.person.firstName()
			)}', '${escape(faker.person.lastName())}');`
	)
	await Promise.all(queries.map(query => db.query(query)))
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

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(id => {
			const query = `SELECT * FROM authors WHERE id = '${id}'`
			return db.query(query)
		})
	)
}
