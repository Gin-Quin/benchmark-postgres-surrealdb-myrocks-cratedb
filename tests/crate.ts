import { fakerDE as faker } from '@faker-js/faker';
import postgres from 'postgres'
import { escape } from './utilities/escape';
import { cpuUsage } from 'process';
import { sleep } from './utilities/sleep';
import { randomUUID } from 'crypto';

const sql = postgres({
	host: 'localhost',
	username: 'crate',
	password: 'password',
	port: 5436,
})

main()

async function main() {
	await initSQL();

	const count = 2048
	const stage = `Insert ${count} authors`
	console.time(stage)
	const ids = await insertAuthors(count)
	console.timeEnd(stage)

	await sleep(1000)

	// console.time("Pick authors")
	// await pickAuthors(ids)
	// console.timeEnd("Pick authors")

	console.time("Select authors")
	await sql`SELECT * FROM AUTHORS`
	console.timeEnd("Select authors")
	// console.log("authors", authors)
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const queries = ids.map(id => `INSERT INTO authors (id, first_name, last_name) VALUES ('${id}', '${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}');`)
	await Promise.all(queries.map(query => sql.unsafe(query)))
	return ids

	// const authors = new Array(count).fill(0).map(() => `('${escape(faker.person.firstName())}', '${escape(faker.person.lastName())}')`)
	// const query = `INSERT INTO AUTHORS VALUES ${authors.join(',')}`
	// await sql.unsafe(query)
}

async function pickAuthors(ids: string[]) {
	await Promise.all(ids.map(id => {
		const query = `SELECT * FROM authors WHERE id = '${ids[0]}'`
		return sql.unsafe(query)
	}))
}

async function initSQL() {
	try {
		await sql.unsafe(`
			DROP TABLE IF EXISTS AUTHORS;
			DROP TABLE IF EXISTS BOOKS;

			CREATE TABLE AUTHORS
			(
				id string PRIMARY KEY,
				first_name string,
				last_name string
			);
		`)
	} catch (error) {
		console.log("Already initialized", error)
	}
}