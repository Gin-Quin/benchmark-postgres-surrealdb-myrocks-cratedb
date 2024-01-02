import { randomUUID, randomBytes } from "node:crypto"
import { RocksDB } from "./rocksdb/bun-rocks-c.lib"

const db = new RocksDB("./rocks.db")

// const put = (key: string, content: Buffer) =>
// 	new Promise(resolve => db.put(key, content, resolve))

// const get = (key: string) => new Promise(resolve => db.get(key, resolve))

// const getMany = (keys: string[]) => new Promise(resolve => db.getMany(keys, resolve))

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

	// console.time("Select authors")
	// await getAllAuthors()
	// console.timeEnd("Select authors")
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
	await Promise.all(ids.map(id => db.get(id)))
	// return await getMany(ids)
}

// async function getAllAuthors() {
// 	const stream = db.createValueStream()
// 	for await (const value of stream) {
// 		// console.log(key, value)
// 	}
// }
