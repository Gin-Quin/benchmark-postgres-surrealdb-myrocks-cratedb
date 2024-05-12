import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
	args: {},
	async handler(ctx, args) {
		return await ctx.db.query("books").collect()
	},
})

export const create = mutation({
	args: {
		author: v.string(),
		title: v.string(),
	},
	async handler(ctx, args) {
		await ctx.db.insert("books", args)
	},
})

export const createMany = mutation({
	args: {
		books: v.array(
			v.object({
				author: v.string(),
				title: v.string(),
			}),
		),
	},
	async handler(ctx, args) {
		await Promise.all(args.books.map(book => ctx.db.insert("books", book)))
	},
})
