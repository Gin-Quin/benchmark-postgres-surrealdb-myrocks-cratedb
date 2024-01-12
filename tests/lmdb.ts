import { open as openLMDB } from "lmdb"
import { randomUUID, randomBytes } from "node:crypto"

const db = openLMDB({
	path: "./lmdb.db",
	compression: true,
	mapSize: 1024 * 1024 * 1024,
	encoding: "binary",
})

main()

async function main() {
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
	const stream = db.getRange()
	for await (const value of stream) {
		// console.log(key, value)
	}
}
