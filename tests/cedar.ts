import { fakerDE as faker } from "@faker-js/faker";
import postgres from "postgres";
import { escape } from "./utilities/escape";
import { randomUUID } from "crypto";

const sql = postgres({
	host: "localhost",
	username: "postgres",
	password: "password",
	port: 5437,
});

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
	console.log("Hello");
	await initSQL();

	console.log("=".repeat(60));
	console.log("🧪 PostgreSQL Performance Benchmark");
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
	console.log(`Database now contains ${count.toLocaleString()} total records`);
	console.log("Memory after bulk insert:", getMemoryUsage());

	// Run benchmark with populated database
	console.log("\n📊 PHASE 3: Benchmark with populated database");
	await runBenchmark("POPULATED DB");

	console.log("\n🏁 Benchmark complete!");
	await sql.end();
}

async function initSQL() {
	try {
		await sql.unsafe(`
		CREATE TABLE AUTHORS
		(
			id TEXT PRIMARY KEY,
			first_name TEXT,
			last_name TEXT,
			email TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);

		CREATE TABLE BOOKS
		(
			id TEXT PRIMARY KEY,
			title TEXT,
			author TEXT REFERENCES AUTHORS(id),
			isbn TEXT,
			price INTEGER,
			publication_year INTEGER,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
		`);
	} catch (error) {
		console.log("Already initialized", error);
	}
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
	await sql`SELECT * FROM AUTHORS WHERE id IN(${ids.map((id) => `'${id}'`)})`;
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
		// Use transaction for better performance
		console.time("Initializing transaction");
		await sql.begin(async (sql) => {
			console.timeEnd("Initializing transaction");

			for (let batch = 0; batch < batches; batch++) {
				const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

				const values = [];
				for (let i = 0; i < currentBatchSize; i++) {
					const firstName = escape(faker.person.firstName());
					const lastName = escape(faker.person.lastName());

					values.push({
						id: randomUUID(),
						first_name: firstName,
						last_name: lastName,
						email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
					});
				}

				const now = Date.now();
				await sql`INSERT INTO authors ${sql(values)}`;

				console.log(
					`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records in ${Date.now() - now}ms`,
				);
			}
		});

		console.log("✅ Bulk insert completed successfully");
	} catch (error) {
		console.error("❌ Bulk insert failed:", error);
		throw error;
	}
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID());

	// Use bulk insert for better performance
	const values = ids.map((id) => {
		const firstName = escape(faker.person.firstName());
		const lastName = escape(faker.person.lastName());

		return {
			id,
			first_name: firstName,
			last_name: lastName,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
		};
	});

	await sql`INSERT INTO authors ${sql(values)}`;
	return ids;
}

async function pickAuthors(ids: string[]) {
	// Use prepared statement equivalent for better performance
	await Promise.all(
		ids.map((id) => sql`SELECT * FROM authors WHERE id = ${id}`),
	);
}

async function complexAnalyticalQuery() {
	await sql`
		SELECT
			SUBSTRING(first_name, 1, 1) as first_letter,
			COUNT(*) as author_count,
			AVG(LENGTH(first_name || ' ' || last_name)) as avg_name_length,
			MIN(LENGTH(last_name)) as min_lastname_length,
			MAX(LENGTH(last_name)) as max_lastname_length
		FROM authors
		WHERE LENGTH(first_name) > 3
		GROUP BY SUBSTRING(first_name, 1, 1)
		HAVING COUNT(*) > 10
		ORDER BY author_count DESC
		LIMIT 10
	`;
}

async function aggregationQuery() {
	await sql`
		SELECT
			COUNT(*) as total_authors,
			COUNT(DISTINCT first_name) as unique_first_names,
			COUNT(DISTINCT last_name) as unique_last_names,
			AVG(LENGTH(first_name)) as avg_first_name_length,
			AVG(LENGTH(last_name)) as avg_last_name_length
		FROM authors
	`;
}

async function getDatabaseSize(): Promise<number> {
	const result = await sql`SELECT COUNT(*) as count FROM authors`;
	return Number(result[0].count);
}
