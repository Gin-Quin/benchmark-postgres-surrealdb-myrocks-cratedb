import SurrealDB from "surrealdb.js";
import { escape } from "./utilities/escape";
import { fakerDE as faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

const db = new SurrealDB();

const BENCHMARK_COUNT = 2048;
const BULK_DATA_COUNT = 1_000_000; // 1 million records

main();

function getMemoryUsage() {
	const usage = process.memoryUsage();
	return {
		rss: Math.round(usage.rss / 1024 / 1024), // MB
		heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
		heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
		external: Math.round(usage.external / 1024 / 1024), // MB
	};
}

async function main() {
	try {
		// Connect to the database
		await db.connect("http://127.0.0.1:8000/rpc");

		// Signin as a namespace, database, or root user
		await db.signin({
			user: "root",
			pass: "root",
		});

		// Initialize database
		await initDatabase();

		console.log("=".repeat(60));
		console.log("🧪 SurrealDB Performance Benchmark");
		console.log("=".repeat(60));

		// Run benchmark with empty database
		console.log("\n📊 PHASE 1: Benchmark with empty database");
		console.log("Memory before:", getMemoryUsage());
		await runBenchmark("EMPTY DB");

		// Add bulk data
		console.log("\n📦 PHASE 2: Loading bulk data...");
		console.log(`Adding ${BULK_DATA_COUNT.toLocaleString()} records...`);
		console.time("Bulk data insert");
		await insertBulkData(BULK_DATA_COUNT);
		console.timeEnd("Bulk data insert");

		// Check database size
		const count = await getDatabaseSize();
		console.log(
			`Database now contains ${count.toLocaleString()} total records`,
		);
		console.log("Memory after bulk insert:", getMemoryUsage());

		// Run benchmark with populated database
		console.log("\n📊 PHASE 3: Benchmark with populated database");
		await runBenchmark("POPULATED DB");

		console.log("\n🏁 Benchmark complete!");
		await db.close();
	} catch (error) {
		console.error("ERROR", error);
	}
}

async function initDatabase() {
	await db.use({ ns: "test", db: "test" });
	await db.query("DELETE author; DELETE book;");
}

async function runBenchmark(phase: string) {
	console.log(`\n--- ${phase} BENCHMARK ---`);

	const memBefore = getMemoryUsage();

	// Insert benchmark records
	const stage = `Insert ${BENCHMARK_COUNT} authors`;
	console.time(stage);
	const ids = await insertAuthors(BENCHMARK_COUNT);
	console.timeEnd(stage);

	// Pick individual records
	console.time("Pick authors");
	await pickAuthors(ids);
	console.timeEnd("Pick authors");

	// Select all benchmark records
	console.time("Select benchmark authors");
	await selectBenchmarkAuthors(ids);
	console.timeEnd("Select benchmark authors");

	// Complex analytical query
	console.time("Complex analytical query");
	await complexAnalyticalQuery();
	console.timeEnd("Complex analytical query");

	// Aggregation query
	console.time("Aggregation query");
	await aggregationQuery();
	console.timeEnd("Aggregation query");

	const memAfter = getMemoryUsage();
	console.log(
		`Memory usage - Before: ${memBefore.rss}MB, After: ${memAfter.rss}MB, Diff: ${memAfter.rss - memBefore.rss}MB`,
	);
}

async function insertBulkData(count: number) {
	const batchSize = 10000;
	const batches = Math.ceil(count / batchSize);

	console.log(
		`Inserting ${count.toLocaleString()} records in ${batches} batches of ${batchSize.toLocaleString()}...`,
	);

	try {
		for (let batch = 0; batch < batches; batch++) {
			const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

			const authors = [];
			for (let i = 0; i < currentBatchSize; i++) {
				const firstName = escape(faker.person.firstName());
				const lastName = escape(faker.person.lastName());

				authors.push({
					id: `bulk_${batch}_${i}_${randomUUID()}`,
					first_name: firstName,
					last_name: lastName,
					email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
				});
			}

			// Use bulk insert for better performance
			await db.query(`INSERT INTO author ${JSON.stringify(authors)}`);

			if ((batch + 1) % 10 === 0) {
				console.log(
					`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records`,
				);
			}
		}

		console.log("✅ Bulk insert completed successfully");
	} catch (error) {
		console.error("❌ Bulk insert failed:", error);
		throw error;
	}
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID());

	// Use bulk insert for better performance
	const authors = ids.map((id) => {
		const firstName = escape(faker.person.firstName());
		const lastName = escape(faker.person.lastName());

		return {
			id: `benchmark_${id}`,
			first_name: firstName,
			last_name: lastName,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
		};
	});

	await db.query(`INSERT INTO author ${JSON.stringify(authors)}`);
	return ids.map((id) => `benchmark_${id}`);
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map((id) => db.query(`SELECT * FROM ONLY author:\`${id}\``)),
	);
}

async function selectBenchmarkAuthors(ids: string[]) {
	// Select all benchmark authors using IN clause
	const idList = ids.map((id) => `"${id}"`).join(", ");
	await db.query(`SELECT * FROM author WHERE id IN [${idList}]`);
}

async function complexAnalyticalQuery() {
	await db.query(`
		SELECT count() as author_count
		FROM author
		WHERE first_name != ''
		LIMIT 10
	`);
}

async function aggregationQuery() {
	await db.query(`
		SELECT count() as total_authors
		FROM author
	`);
}

async function getDatabaseSize(): Promise<number> {
	const result = await db.query("SELECT count() as count FROM author");
	return result[0]?.count || 0;
}
