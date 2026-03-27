import { fakerDE as faker } from "@faker-js/faker";
import { createClient } from "@clickhouse/client";
import { escape } from "./utilities/escape";
import { randomUUID } from "crypto";

const client = createClient({
	url: "http://localhost:8124",
	username: "default",
	password: "password",
	database: "default",
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
	await initSQL();

	console.log("=".repeat(60));
	console.log("🧪 ClickHouse Performance Benchmark");
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
	await client.close();
}

async function initSQL() {
	try {
		// Drop existing tables
		await client.command({
			query: `DROP TABLE IF EXISTS books`,
		});
		await client.command({
			query: `DROP TABLE IF EXISTS authors`,
		});

		// Create authors table with ClickHouse specific optimizations
		await client.command({
			query: `
				CREATE TABLE authors
				(
					id UUID,
					first_name String,
					last_name String,
					email String,
					created_at DateTime DEFAULT now()
				)
				ENGINE = MergeTree()
				ORDER BY (id)
				PRIMARY KEY (id)
			`,
		});

		console.log("✅ Tables initialized successfully");
	} catch (error) {
		console.log("Error during initialization:", error);
		throw error;
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
	await client.query({
		query: `SELECT * FROM authors WHERE id IN {ids:Array(UUID)}`,
		query_params: { ids },
	});
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

			await client.insert({
				table: "authors",
				values,
				format: "JSONEachRow",
			});

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

	// Prepare batch data for ClickHouse
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

	// Use ClickHouse's efficient batch insert
	await client.insert({
		table: "authors",
		values,
		format: "JSONEachRow",
	});

	return ids;
}

async function pickAuthors(ids: string[]) {
	// Execute queries in batches to avoid overwhelming ClickHouse
	const batchSize = 50; // Process 50 concurrent requests at a time
	for (let i = 0; i < ids.length; i += batchSize) {
		const batch = ids.slice(i, i + batchSize);
		await Promise.all(
			batch.map((id) =>
				client.query({
					query: `SELECT * FROM authors WHERE id = {id:UUID}`,
					query_params: { id },
				}),
			),
		);
	}
}

async function complexAnalyticalQuery() {
	await client.query({
		query: `
			SELECT
				substring(first_name, 1, 1) as first_letter,
				count(*) as author_count,
				avg(length(concat(first_name, ' ', last_name))) as avg_name_length,
				min(length(last_name)) as min_lastname_length,
				max(length(last_name)) as max_lastname_length
			FROM authors
			WHERE length(first_name) > 3
			GROUP BY substring(first_name, 1, 1)
			HAVING count(*) > 10
			ORDER BY author_count DESC
			LIMIT 10
		`,
	});
}

async function aggregationQuery() {
	await client.query({
		query: `
			SELECT
				count(*) as total_authors,
				uniqExact(first_name) as unique_first_names,
				uniqExact(last_name) as unique_last_names,
				avg(length(first_name)) as avg_first_name_length,
				avg(length(last_name)) as avg_last_name_length
			FROM authors
		`,
	});
}

async function getDatabaseSize(): Promise<number> {
	const result = await client.query({
		query: `SELECT count(*) as count FROM authors`,
		format: "JSONEachRow",
	});

	const rows = await result.json<{ count: string }>();
	return parseInt(rows[0].count);
}
