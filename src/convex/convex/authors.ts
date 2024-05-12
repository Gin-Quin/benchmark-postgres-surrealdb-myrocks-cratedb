import { v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const list = query({
	args: {},
	async handler(ctx, args) {
		return await ctx.db.query("authors").take(2048)
	},
})

export const pick = query({
	args: {
		id: v.id("authors"),
	},
	async handler(ctx, { id }) {
		return await ctx.db.get(id)
	},
})

export const pickMany = query({
	args: {
		ids: v.array(v.id("authors")),
	},
	async handler(ctx, { ids }) {
		return Promise.all(ids.map(id => ctx.db.get(id)))
	},
})

export const create = mutation({
	args: {
		first_name: v.string(),
		last_name: v.string(),
	},
	async handler(ctx, args) {
		await ctx.db.insert("authors", args)
	},
})

export const createMany = mutation({
	args: {
		authors: v.array(
			v.object({
				first_name: v.string(),
				last_name: v.string(),
			}),
		),
	},
	async handler(ctx, args) {
		await Promise.all(args.authors.map(author => ctx.db.insert("authors", author)))
	},
})

export const update = mutation({
	args: {
		id: v.id("authors"),
		first_name: v.string(),
		last_name: v.string(),
	},
	async handler(ctx, { id, ...args }) {
		await ctx.db.patch(id, args)
	},
})

export const updateMany = mutation({
	args: {
		authors: v.array(
			v.object({
				id: v.id("authors"),
				first_name: v.string(),
				last_name: v.string(),
			}),
		),
	},
	async handler(ctx, args) {
		await Promise.all(args.authors.map(({ id, ...author }) => ctx.db.patch(id, author)))
	},
})
