import { randomUUID, randomBytes } from "node:crypto"
import * as fs from "node:fs"

const db = "file-system-bun.db"

main()

async function main() {
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
	await getAllAuthors()
	console.timeEnd("Select authors")
}

async function initDatabase() {
	fs.rmSync(db, { recursive: true, force: true })
	fs.mkdirSync(db)
	fs.mkdirSync(`${db}/authors`)
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const content = randomBytes(1024)

	const queries = ids.map(id => {
		return Bun.write(`${db}/authors/${id}.bin`, content)
	})

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
			return Bun.file(`${db}/authors/${id}.bin`).arrayBuffer()
		})
	)
}

async function getAllAuthors() {
	return await Promise.all(
		fs.readdirSync(`${db}/authors`).map(async file => {
			return await Bun.file(`${db}/authors/${file}`).arrayBuffer()
		})
	)
}
