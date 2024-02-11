import { randomUUID, randomBytes } from "node:crypto"
import levelup from "levelup"
import leveldown from "leveldown"

const db = levelup(leveldown("./level.db"))

main()

async function main() {
	// await initDatabase()

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

	console.time("Select 1 author")
	await pickAuthors([ids[0]])
	console.timeEnd("Select 1 author")

	console.time("Select X times the same author")
	await pickAuthors(new Array(count).fill(ids[0]))
	console.timeEnd("Select X times the same author")
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())
	const content = randomBytes(1024)

	const queries = ids.map(async id => {
		await db.put(id, content)
		return id
	})

	return await Promise.all(queries)
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(async id => {
			const result = await db.get(id)
			// console.log(result.length)
			return result
		})
	)
	// return await db.getMany(ids)
}

async function getAllAuthors() {
	const stream = db.createValueStream()
	for await (const value of stream) {
		// console.log(key, value)
	}
}
