import { db } from "./db"

const now = Date.now()
db.query(`SELECT * FROM authors LIMIT 2048`).run()
console.log("Read authors:", Date.now() - now, "ms")
