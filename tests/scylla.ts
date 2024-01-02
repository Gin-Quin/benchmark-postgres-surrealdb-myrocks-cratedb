import { fakerDE as faker } from "@faker-js/faker"
import cassandra, { Client } from "cassandra-driver"
import { escape } from "./utilities/escape"
import { randomUUID } from "crypto"
import { cpuUsage } from "process"

const client = new cassandra.Client({
	contactPoints: ["127.0.0.1"],
	localDataCenter: "datacenter1",
})

main()

async function main() {
	await client.connect()
	console.log("Connected to Scylla")
	// client.keyspace = 'test'

	await initDB(client)
	console.log("Initialized DB")

	const count = 2048
	const stage = `Insert ${count} authors`
	console.time(stage)
	const ids = await insertAuthors(client, count)
	console.timeEnd(stage)

	console.time("Pick authors")
	await pickAuthors(client, ids)
	console.timeEnd("Pick authors")

	console.time("Select authors")
	const authors = await selectAuthors(client)
	console.timeEnd("Select authors")
	// console.log("Selected authors", authors.rows)
}

async function initDB(client: Client) {
	await client.execute(`
		DROP KEYSPACE IF EXISTS test;
	`)
	await client.execute(`
		CREATE KEYSPACE test WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};
	`)
	await client.execute(`
		USE test;
	`)
	await client.execute(`
		CREATE TABLE authors (
			id text PRIMARY KEY,
			first_name text,
			last_name text
		);
	`)
}

async function selectAuthors(client: Client) {
	const query = "SELECT * FROM authors"
	return await client.execute(query)
}

async function pickAuthors(client: Client, ids: string[]) {
	await Promise.all(
		ids.map(id => {
			const query = `SELECT * FROM authors WHERE id = '${id}'`
			return client.execute(query)
		})
	)
}

async function insertAuthors(client: Client, count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const queries = ids.map(
		id =>
			`INSERT INTO authors (id, first_name, last_name) VALUES ('${id}', '${escape(
				faker.person.firstName()
			)}', '${escape(faker.person.lastName())}');`
	)
	await Promise.all(queries.map(query => client.execute(query)))
	return ids
	// for (const query of queries) {
	// 	await client.execute(query);
	// }
}
