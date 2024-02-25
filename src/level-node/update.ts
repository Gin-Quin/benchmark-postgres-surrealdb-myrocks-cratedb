import { ids } from "../utilities/getIds"
import { db } from "./db"
import { randomBytes } from "node:crypto"

const data = ids.map(id => ({
	key: ids[0],
	value: randomBytes(1024),
}))

const now = Date.now()
await Promise.all(data.map(record => db.put(record.key, record.value)))
console.log("Update author by id:", Date.now() - now, "ms")
