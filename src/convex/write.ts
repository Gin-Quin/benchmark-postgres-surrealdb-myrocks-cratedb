import { ConvexClient } from "convex/browser"
import { api } from "./convex/_generated/api"
import { ids } from "../utilities/getIds"
import { escape } from "../utilities/escape"
import { faker } from "@faker-js/faker"

const client = new ConvexClient(process.env["CONVEX_URL"] ?? "")

const data = ids.map(() => ({
	first_name: escape(faker.person.firstName()),
	last_name: escape(faker.person.lastName()),
}))

{
	const now = Date.now()
	await client.mutation(api.authors.createMany, { authors: data })
	console.log("Write authors by batch:", Date.now() - now, "ms")
}

{
	const now = Date.now()
	for (const author of data) {
		await client.mutation(api.authors.create, author)
	}
	console.log("Write authors one by one:", Date.now() - now, "ms")
}
