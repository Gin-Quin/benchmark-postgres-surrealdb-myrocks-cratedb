import { ConvexClient } from "convex/browser"
import { api } from "./convex/_generated/api"
import { escape } from "../utilities/escape"
import { faker } from "@faker-js/faker"
import { Id } from "./convex/_generated/dataModel"

const client = new ConvexClient(process.env["CONVEX_URL"] ?? "")

const authors = await client.query(api.authors.list, {})
const ids = authors.map(author => author._id)

const data = ids.map(id => ({
	id: id as Id<"authors">,
	first_name: escape(faker.person.firstName()),
	last_name: escape(faker.person.lastName()),
}))

{
	const now = Date.now()
	await client.mutation(api.authors.updateMany, { authors: data })
	console.log("Update authors by batch:", Date.now() - now, "ms")
}

{
	const now = Date.now()
	for (const author of data) {
		await client.mutation(api.authors.update, author)
	}
	console.log("Update authors one by one:", Date.now() - now, "ms")
}
