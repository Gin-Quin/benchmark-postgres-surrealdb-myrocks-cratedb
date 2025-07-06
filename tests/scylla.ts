import { fakerDE as faker } from "@faker-js/faker";
import cassandra from "cassandra-driver";
import { escape } from "./utilities/escape";
import { randomUUID } from "crypto";

const client = new cassandra.Client({
	contactPoints: ["127.0.0.1"],
	localDataCenter: "datacenter1",
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
	await client.connect();
	console.log("Connected to Scylla");

	await initDB();

	console.log("=".repeat(60));
	console.log("🧪 Scylla Performance Benchmark");
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
	await client.shutdown();
}

async function initDB() {
	try {
		await client.execute(`
			DROP KEYSPACE IF EXISTS test;
		`);
		await client.execute(`
			CREATE KEYSPACE test WITH replication = {'class':'SimpleStrategy', 'replication_factor':1};
		`);
		await client.execute(`
			USE test;
		`);
		await client.execute(`
			CREATE TABLE authors (
				id text PRIMARY KEY,
				first_name text,
				last_name text,
				email text,
				created_at timestamp
			);
		`);
		await client.execute(`
			CREATE TABLE books (
				id text PRIMARY KEY,
				title text,
				author text,
				isbn text,
				price int,
				publication_year int,
				created_at timestamp
			);
		`);

		// Create secondary indexes for better query performance
		await client.execute(`
			CREATE INDEX ON authors (first_name);
		`);
		await client.execute(`
			CREATE INDEX ON authors (last_name);
		`);
		await client.execute(`
			CREATE INDEX ON books (author);
		`);
		await client.execute(`
			CREATE INDEX ON books (publication_year);
		`);

		console.log("Initialized DB");
	} catch (error) {
		console.log("Database initialization error:", error);
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
			const queries = [];

			for (let i = 0; i < currentBatchSize; i++) {
				const id = randomUUID();
				const firstName = escape(faker.person.firstName());
				const lastName = escape(faker.person.lastName());
				const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

				queries.push(
					client.execute(
						`INSERT INTO authors (id, first_name, last_name, email, created_at) VALUES (?, ?, ?, ?, toTimestamp(now()))`,
						[id, firstName, lastName, email],
						{ prepare: true },
					),
				);
			}

			await Promise.all(queries);

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

	// Use prepared statements for better performance
	const insertQueries = ids.map((id) => {
		const firstName = escape(faker.person.firstName());
		const lastName = escape(faker.person.lastName());
		const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

		return client.execute(
			`INSERT INTO authors (id, first_name, last_name, email, created_at) VALUES (?, ?, ?, ?, toTimestamp(now()))`,
			[id, firstName, lastName, email],
			{ prepare: true },
		);
	});

	await Promise.all(insertQueries);
	return ids;
}

async function pickAuthors(ids: string[]) {
	// Use prepared statements for individual record picking
	await Promise.all(
		ids.map((id) =>
			client.execute(`SELECT * FROM authors WHERE id = ?`, [id], {
				prepare: true,
			}),
		),
	);
}

async function selectBenchmarkAuthors(ids: string[]) {
	// Since Cassandra doesn't support IN queries efficiently, we'll select all and filter
	const result = await client.execute("SELECT * FROM authors");
	const benchmarkAuthors = result.rows.filter((row) => ids.includes(row.id));
	return benchmarkAuthors;
}

async function complexAnalyticalQuery() {
	// Note: Cassandra has limitations with complex analytical queries
	// This is a simplified version that works within Cassandra's constraints
	const result = await client.execute(`
		SELECT first_name, last_name FROM authors
	`);

	// Process results in application code since Cassandra doesn't support complex aggregations
	const analysis = result.rows.reduce((acc, row) => {
		if (row.first_name && row.first_name.length > 3) {
			const firstLetter = row.first_name.charAt(0).toUpperCase();
			if (!acc[firstLetter]) {
				acc[firstLetter] = {
					count: 0,
					totalNameLength: 0,
					lastNameLengths: [],
				};
			}
			acc[firstLetter].count++;
			acc[firstLetter].totalNameLength += (
				row.first_name +
				" " +
				row.last_name
			).length;
			acc[firstLetter].lastNameLengths.push(row.last_name.length);
		}
		return acc;
	}, {} as any);

	// Sort and limit results
	const sortedResults = Object.entries(analysis)
		.filter(([_, data]: any) => data.count > 10)
		.sort(([_, a]: any, [__, b]: any) => b.count - a.count)
		.slice(0, 10);

	return sortedResults;
}

async function aggregationQuery() {
	const result = await client.execute(`
		SELECT first_name, last_name FROM authors
	`);

	// Process aggregations in application code
	let totalAuthors = 0;
	const uniqueFirstNames = new Set();
	const uniqueLastNames = new Set();
	let totalFirstNameLength = 0;
	let totalLastNameLength = 0;

	result.rows.forEach((row) => {
		if (row.first_name && row.last_name) {
			totalAuthors++;
			uniqueFirstNames.add(row.first_name);
			uniqueLastNames.add(row.last_name);
			totalFirstNameLength += row.first_name.length;
			totalLastNameLength += row.last_name.length;
		}
	});

	const aggregation = {
		total_authors: totalAuthors,
		unique_first_names: uniqueFirstNames.size,
		unique_last_names: uniqueLastNames.size,
		avg_first_name_length:
			totalAuthors > 0 ? totalFirstNameLength / totalAuthors : 0,
		avg_last_name_length:
			totalAuthors > 0 ? totalLastNameLength / totalAuthors : 0,
	};

	return aggregation;
}

async function getDatabaseSize(): Promise<number> {
	const result = await client.execute("SELECT COUNT(*) as count FROM authors");
	return Number(result.rows[0].count);
}
