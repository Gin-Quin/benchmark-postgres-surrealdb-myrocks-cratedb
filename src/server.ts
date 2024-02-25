/**
 * Test SQLite with bun and node+better-sqlite3 on a Fly.io instance.
 */
function startBenchmarks() {
	console.log("\n[------ Bun + FS ------]")
	spawn("fs-bun", "write")
	console.log(" ~ ")
	spawn("fs-bun", "update")
	console.log(" ~ ")
	spawn("fs-bun", "pick")

	console.log("\n[------ Node + FS ------]")
	spawn("fs-node", "write")
	console.log(" ~ ")
	spawn("fs-node", "update")
	console.log(" ~ ")
	spawn("fs-node", "pick")

	console.log("\n[------ Bun + SQLite ------]")
	spawn("sqlite-bun", "init")
	spawn("sqlite-bun", "write")
	spawn("sqlite-bun", "update")
	spawn("sqlite-bun", "batch")
	spawn("sqlite-bun", "pick")
	spawn("sqlite-bun", "read")

	console.log("\n[------ Node + SQLite ------]")
	spawn("sqlite-node", "init")
	spawn("sqlite-node", "write")
	spawn("sqlite-bun", "update")
	spawn("sqlite-node", "batch")
	spawn("sqlite-node", "pick")
	spawn("sqlite-node", "read")

	console.log("\n[------ Bun + Level ------]")
	spawn("level-bun", "write")
	spawn("level-bun", "update")
	spawn("level-bun", "batch")
	spawn("level-bun", "pick")
	spawn("level-bun", "read")

	console.log("\n[------ Node + Level ------]")
	spawn("level-node", "write")
	spawn("level-node", "update")
	spawn("level-node", "batch")
	spawn("level-node", "pick")
	spawn("level-node", "read")
}

function spawn(
	target: `${"sqlite" | "level" | "fs"}-${"bun" | "node"}`,
	operation: `${"init" | "write" | "batch" | "pick" | "read" | "update"}`
) {
	const args = ["bun", "run", `./src/${target}/${operation}.ts`]
	if (target.endsWith("node")) {
		args.splice(2, 0, "esrun")
	}
	Bun.spawnSync(args, {
		stdio: ["inherit", "inherit", "inherit"],
	})
}

const server = Bun.serve({
	port: 8080,
	async fetch(request) {
		if (new URL(request.url).pathname !== "/")
			return new Response("Not found", { status: 404 })
		const now = Date.now()
		console.log("\n ~ ~ Starting benchmarks! ~ ~")
		startBenchmarks()
		console.log(`\n ~ ~ Benchmarks done in ${Date.now() - now}ms ~ ~ `)
		return new Response(`Benchmarks done in ${Date.now() - now}ms`)
	},
})

console.log(`Listening on ${server.url}`)
