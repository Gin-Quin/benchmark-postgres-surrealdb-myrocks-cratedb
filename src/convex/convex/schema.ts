import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	books: defineTable({
		author: v.string(),
		title: v.string(),
	}),
	authors: defineTable({
		first_name: v.string(),
		last_name: v.string(),
	}),
})
