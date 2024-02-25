import { db } from "./db"

const pickAuthorQuery = db.query(`SELECT * FROM authors WHERE id = ?`)

const authors = db.query(`SELECT id FROM authors LIMIT 2048`).all() as Array<{
	id: string
}>
const ids = authors.map(author => author.id)

// shuffle ids
for (let i = ids.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1))
	;[ids[i], ids[j]] = [ids[j], ids[i]]
}

const now = Date.now()
ids.forEach(id => pickAuthorQuery.run(id))
console.log("Pick authors:", Date.now() - now, "ms")
