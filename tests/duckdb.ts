import { fakerDE as faker } from "@faker-js/faker";
import { DuckDBInstance } from "@duckdb/node-api";
import { randomUUID } from "crypto";
import { escape } from "./utilities/escape";

let instance: DuckDBInstance;
let connection: any;

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
	await initSQL();

	console.log("=".repeat(60));
	console.log("🧪 DuckDB Performance Benchmark");
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
	connection.closeSync();
}

async function initSQL() {
	instance = await DuckDBInstance.create("test_large.duckdb", {
		threads: "4",
	});
	connection = await instance.connect();

	await connection.run(`
	DROP TABLE IF EXISTS BOOKS;
	DROP TABLE IF EXISTS AUTHORS;

	CREATE TABLE AUTHORS
	(
		id VARCHAR PRIMARY KEY,
		first_name VARCHAR,
		last_name VARCHAR,
		email VARCHAR,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE BOOKS
	(
		id VARCHAR PRIMARY KEY,
		title VARCHAR,
		author VARCHAR REFERENCES AUTHORS(id),
		isbn VARCHAR,
		price INTEGER,
		publication_year INTEGER,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	-- Create indexes for better performance
	CREATE INDEX idx_authors_name ON AUTHORS(first_name, last_name);
	CREATE INDEX idx_books_author ON BOOKS(author);
	CREATE INDEX idx_books_year ON BOOKS(publication_year);`);
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
	const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
	await connection.run(
		`SELECT * FROM AUTHORS WHERE id IN (${placeholders})`,
		ids,
	);
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

	// Use transaction for better performance
	await connection.run("BEGIN TRANSACTION");

	try {
		const prepared = await connection.prepare(
			`INSERT INTO authors (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`,
		);

		for (let batch = 0; batch < batches; batch++) {
			const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

			for (let i = 0; i < currentBatchSize; i++) {
				const firstName = escape(faker.person.firstName());
				const lastName = escape(faker.person.lastName());

				prepared.bindVarchar(1, randomUUID());
				prepared.bindVarchar(2, firstName);
				prepared.bindVarchar(3, lastName);
				prepared.bindVarchar(
					4,
					`${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
				);
				await prepared.run();
			}

			if ((batch + 1) % 10 === 0) {
				console.log(
					`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records`,
				);
			}
		}

		await connection.run("COMMIT");
		console.log("✅ Bulk insert completed successfully");
	} catch (error) {
		await connection.run("ROLLBACK");
		console.error("❌ Bulk insert failed:", error);
		throw error;
	}
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID());

	const prepared = await connection.prepare(
		`INSERT INTO authors (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`,
	);

	for (const id of ids) {
		const firstName = escape(faker.person.firstName());
		const lastName = escape(faker.person.lastName());

		prepared.bindVarchar(1, id);
		prepared.bindVarchar(2, firstName);
		prepared.bindVarchar(3, lastName);
		prepared.bindVarchar(
			4,
			`${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
		);
		await prepared.run();
	}

	return ids;
}

async function pickAuthors(ids: string[]) {
	const prepared = await connection.prepare(
		`SELECT * FROM authors WHERE id = $1`,
	);

	for (const id of ids) {
		prepared.bindVarchar(1, id);
		await prepared.run();
	}
}

async function complexAnalyticalQuery() {
	await connection.run(`
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
	`);
}

async function aggregationQuery() {
	await connection.run(`
		SELECT
			COUNT(*) as total_authors,
			COUNT(DISTINCT first_name) as unique_first_names,
			COUNT(DISTINCT last_name) as unique_last_names,
			AVG(LENGTH(first_name)) as avg_first_name_length,
			AVG(LENGTH(last_name)) as avg_last_name_length
		FROM authors
	`);
}

async function getDatabaseSize(): Promise<number> {
	const result = await connection.run(`SELECT COUNT(*) as count FROM authors`);
	const reader = await result.fetchAllChunks();
	const rows = reader[0].getRows();
	return rows[0][0];
}
