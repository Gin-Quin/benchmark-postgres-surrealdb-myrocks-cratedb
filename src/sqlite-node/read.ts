import Database from "better-sqlite3"
import { volume } from "../utilities/volume"

const db = new Database(`${volume}/db-node.sqlite`)

const now = Date.now()
db.prepare(`SELECT * FROM authors LIMIT 2048`).run()
console.log("Read authors:", Date.now() - now, "ms")
