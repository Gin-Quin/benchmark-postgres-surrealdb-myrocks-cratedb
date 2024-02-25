import { ids } from "../utilities/getIds"
import { db } from "./db"
import { randomBytes } from "node:crypto"

const data = ids.map(id => ({
	key: id,
	type: "put" as const,
	value: randomBytes(1024),
}))

const now = Date.now()
await db.batch(data)
console.log("Write authors by batch:", Date.now() - now, "ms")
