import { ConvexClient } from "convex/browser"
import { api } from "./convex/_generated/api"

console.log("Hello via Bun!")

const client = new ConvexClient(process.env["CONVEX_URL"] ?? "")

const unsubscribe = client.onUpdate(api.books.list, {}, async books => {
	console.log("Books:", books)
})

await Bun.sleep(1000)

client.mutation(api.books.create, { author: "John Doe", title: "Hello, World!" })

await Bun.sleep(1000)

client.mutation(api.books.createMany, {
	books: [
		{ author: "Jane Doe", title: "Hello, Jane!" },
		{ author: "John Doe", title: "Hello, John!" },
	],
})

await Bun.sleep(1000)

unsubscribe()

await client.close()
