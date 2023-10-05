import SurrealDB from "surrealdb.js"
import { escape } from "./utilities/escape";
import { fakerDE as faker } from '@faker-js/faker';
import { cpuUsage } from "process";
import { randomUUID } from "crypto";

const db = new SurrealDB();

main()

async function main() {
	try {
		// Connect to the database
		await db.connect('http://127.0.0.1:8000/rpc');

		// Signin as a namespace, database, or root user
		await db.signin({
			user: 'root',
			pass: 'root',
		});

		// Select a specific namespace / database
		await initDatabase()

		const count = 2048
		const stage = `Insert ${count} authors`
		console.time(stage)
		const ids = await insertAuthors(count)
		console.timeEnd(stage)
	
		console.time("Pick authors")
		await pickAuthors(ids)
		console.timeEnd("Pick authors")

		console.time("Select authors")
		await db.select("author")
		console.timeEnd("Select authors")

		await db.close();
		
	} catch (error) {
		console.error('ERROR', error);

	}
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const queries = ids.map(id => `CREATE author:\`${id}\` CONTENT {
		first_name: '${escape(faker.person.firstName())}',
		last_name: '${escape(faker.person.lastName())}'
	};`)
	await Promise.all(queries.map(query => db.query(query)))
	return ids;

// 	const authors = new Array(count).fill(0).map(() => `{
// 	first_name: '${escape(faker.person.firstName())}',
// 	last_name: '${escape(faker.person.lastName())}'
// }`)
// 	await db.query(`INSERT INTO author [${authors.join(',')}]`)
}


async function initDatabase() {
	await db.use({ns: 'test', db: 'test'});
	await db.query(`DELETE author; DELETE book;`)
}

async function pickAuthors(ids: string[]) {
	await Promise.all(ids.map(id => db.query(`SELECT * FROM ONLY author:\`${ids[0]}\``)))
}