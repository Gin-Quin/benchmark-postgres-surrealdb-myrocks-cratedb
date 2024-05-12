import { fakerDE as faker } from "@faker-js/faker"
import postgres from "postgres"
import { escape } from "./utilities/escape"
import { randomUUID } from "crypto"

const sql = postgres({
	host: "localhost",
	username: "admin",
	password: "quest",
	port: 8812,
})

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

	// console.time("Select authors")
	// await sql`SELECT * FROM AUTHORS`
	// console.timeEnd("Select authors")
	// console.log("authors", authors)
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const queries = ids.map(
		id =>
			`INSERT INTO authors (id, ts, first_name, last_name) VALUES ('${id}', ${
				Date.now() * 1000
			}, '${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}');`
	)
	await Promise.all(queries.map(query => sql.unsafe(query)))
	return ids

	// const authors = new Array(count).fill(0).map(() => `('${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}')`)
	// const query = `INSERT INTO AUTHORS(first_name, last_name) VALUES ${authors.join(',')}`
	// await sql.unsafe(query)
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(id => {
			const query = `SELECT * FROM authors WHERE id = '${ids[0]}'`
			return sql.unsafe(query)
		})
	)
}

async function initSQL() {
	try {
		await sql.unsafe(`
		DROP TABLE IF EXISTS authors;
	`)
	} catch (error) {
		// console.log("\nCan't drop tables. Do they already exist?\n\n", error)
	}

	try {
		await sql.unsafe(`
		CREATE TABLE IF NOT EXISTS authors
		(
			id UUID,
			ts TIMESTAMP,
			first_name TEXT,
			last_name TEXT
		) TIMESTAMP(ts) PARTITION BY DAY;
	`)
	} catch (error) {
		console.log("Can't crate tables:", error)
	}
}
