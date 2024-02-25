import { db } from "./db"

const ids = new Array<string>()

for await (const [key] of db.iterator({
	keys: true,
	values: false,
	limit: 2048,
}) as any) {
	ids.push(key)
}

// shuffle ids
for (let i = ids.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1))
	;[ids[i], ids[j]] = [ids[j], ids[i]]
}

const now = Date.now()
await Promise.all(ids.map(id => db.get(id)))
console.log("Picked authors:", Date.now() - now, "ms")
