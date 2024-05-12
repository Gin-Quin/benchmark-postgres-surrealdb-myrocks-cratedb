import { ConvexClient } from "convex/browser"
import { api } from "./convex/_generated/api"
import { Id } from "./convex/_generated/dataModel"

const client = new ConvexClient(process.env["CONVEX_URL"] ?? "")
let ids: Id<"authors">[] = []

{
	const now = Date.now()
	const authors = await client.query(api.authors.list, {})
	ids = authors.map(author => author._id)
	console.log("Read authors:", Date.now() - now, "ms")
}

{
	const now = Date.now()
	await Promise.all(ids.map(id => client.query(api.authors.pick, { id })))
	console.log("Pick author by id:", Date.now() - now, "ms")
}

{
	const now = Date.now()
	await client.query(api.authors.pickMany, { ids })
	console.log("Pick author by id (batch):", Date.now() - now, "ms")
}
