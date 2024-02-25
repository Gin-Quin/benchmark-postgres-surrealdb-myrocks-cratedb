import { db } from "./db"

const now = Date.now()
const records = new Array<any>()
for await (const record of db.iterator({
	keys: true,
	values: true,
	limit: 2048,
}) as any) {
	records.push(record)
}
console.log("Read authors:", Date.now() - now, "ms")
