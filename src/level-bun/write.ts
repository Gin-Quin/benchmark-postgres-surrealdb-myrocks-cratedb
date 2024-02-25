import { ids } from "../utilities/getIds"
import { db } from "./db"
import { randomBytes } from "node:crypto"

const data = ids.map(id => ({
	key: id,
	value: randomBytes(1024),
}))

const now = Date.now()
await Promise.all(data.map(record => db.put(record.key, record.value)))
console.log("Write authors one by one:", Date.now() - now, "ms")
