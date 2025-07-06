import { fakerDE as faker } from "@faker-js/faker";
import postgres from "postgres";
import { escape } from "./utilities/escape";
import { randomUUID } from "crypto";

const sql = postgres({
	host: "localhost",
	username: "postgres",
	password: "password",
	port: 54352,
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
	console.log("🧪 PostgreSQL TimescaleDB Performance Benchmark");
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

	// Wait for continuous aggregates to update
	console.log("\n⏳ Waiting for continuous aggregates to refresh...");
	await refreshContinuousAggregates();

	// Run benchmark with populated database
	console.log("\n📊 PHASE 3: Benchmark with populated database");
	await runBenchmark("POPULATED DB");

	console.log("\n🏁 Benchmark complete!");
	await sql.end();
}

async function initSQL() {
	try {
		console.log("🔧 Initializing PostgreSQL with TimescaleDB extension...");

		// Install TimescaleDB extension
		await sql.unsafe(`CREATE EXTENSION IF NOT EXISTS timescaledb;`);
		console.log("✅ TimescaleDB extension loaded");

		// Drop existing objects
		await sql.unsafe(`
		DROP MATERIALIZED VIEW IF EXISTS author_hourly_stats;
		DROP MATERIALIZED VIEW IF EXISTS author_daily_analytics;
		DROP MATERIALIZED VIEW IF EXISTS author_realtime_stats;
		DROP TABLE IF EXISTS BOOKS;
		DROP TABLE IF EXISTS AUTHORS CASCADE;
		`);

		// Create tables with proper time column for hypertable
		await sql.unsafe(`
		CREATE TABLE AUTHORS
		(
			id TEXT NOT NULL,
			first_name TEXT,
			last_name TEXT,
			email TEXT,
			created_at TIMESTAMPTZ DEFAULT NOW(),
			UNIQUE (id, created_at)
		);

		CREATE TABLE BOOKS
		(
			id TEXT PRIMARY KEY,
			title TEXT,
			author TEXT,
			isbn TEXT,
			price INTEGER,
			publication_year INTEGER,
			created_at TIMESTAMPTZ DEFAULT NOW()
		);
		`);

		// Convert AUTHORS table to hypertable
		console.log("🕰️ Converting AUTHORS table to hypertable...");
		await sql.unsafe(`
		SELECT create_hypertable('AUTHORS', 'created_at',
			chunk_time_interval => INTERVAL '1 hour',
			if_not_exists => TRUE
		);
		`);

		// Create indexes for better performance
		await sql.unsafe(`
		CREATE INDEX idx_authors_id ON AUTHORS(id);
		CREATE INDEX idx_authors_name ON AUTHORS(first_name, last_name);
		CREATE INDEX idx_authors_created_at ON AUTHORS(created_at);
		CREATE INDEX idx_books_author ON BOOKS(author);
		CREATE INDEX idx_books_year ON BOOKS(publication_year);
		`);

		// Create continuous aggregates
		console.log("📊 Creating continuous aggregates...");

		// Hourly statistics continuous aggregate
		await sql.unsafe(`
		CREATE MATERIALIZED VIEW author_hourly_stats
		WITH (timescaledb.continuous) AS
		SELECT
			time_bucket('1 hour', created_at) as hour_bucket,
			COUNT(*) as authors_count,
			COUNT(DISTINCT first_name) as unique_first_names,
			COUNT(DISTINCT last_name) as unique_last_names,
			AVG(LENGTH(first_name)) as avg_first_name_length,
			AVG(LENGTH(last_name)) as avg_last_name_length,
			AVG(LENGTH(first_name || ' ' || last_name)) as avg_full_name_length
		FROM authors
		GROUP BY hour_bucket
		WITH NO DATA;
		`);

		// Daily analytics continuous aggregate
		await sql.unsafe(`
		CREATE MATERIALIZED VIEW author_daily_analytics
		WITH (timescaledb.continuous) AS
		SELECT
			time_bucket('1 day', created_at) as day_bucket,
			SUBSTRING(first_name, 1, 1) as first_letter,
			COUNT(*) as author_count,
			AVG(LENGTH(first_name || ' ' || last_name)) as avg_name_length,
			MIN(LENGTH(last_name)) as min_lastname_length,
			MAX(LENGTH(last_name)) as max_lastname_length
		FROM authors
		WHERE LENGTH(first_name) > 3
		GROUP BY day_bucket, SUBSTRING(first_name, 1, 1)
		WITH NO DATA;
		`);

		// Real-time stats continuous aggregate (5-minute buckets)
		await sql.unsafe(`
		CREATE MATERIALIZED VIEW author_realtime_stats
		WITH (timescaledb.continuous) AS
		SELECT
			time_bucket('5 minutes', created_at) as time_bucket,
			COUNT(*) as total_authors,
			COUNT(DISTINCT first_name) as unique_first_names,
			COUNT(DISTINCT last_name) as unique_last_names
		FROM authors
		GROUP BY time_bucket
		WITH NO DATA;
		`);

		// Add refresh policies for automatic updates
		console.log("⚙️ Adding continuous aggregate refresh policies...");

		await sql.unsafe(`
		SELECT add_continuous_aggregate_policy('author_hourly_stats',
			start_offset => INTERVAL '4 hours',
			end_offset => INTERVAL '1 hour',
			schedule_interval => INTERVAL '30 minutes'
		);
		`);

		await sql.unsafe(`
		SELECT add_continuous_aggregate_policy('author_daily_analytics',
			start_offset => INTERVAL '3 days',
			end_offset => INTERVAL '1 day',
			schedule_interval => INTERVAL '1 hour'
		);
		`);

		await sql.unsafe(`
		SELECT add_continuous_aggregate_policy('author_realtime_stats',
			start_offset => INTERVAL '1 hour',
			end_offset => INTERVAL '10 minutes',
			schedule_interval => INTERVAL '5 minutes'
		);
		`);

		console.log("✅ TimescaleDB continuous aggregates created successfully");
	} catch (error) {
		console.error("❌ Failed to initialize TimescaleDB:", error);
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
	await sql`SELECT * FROM AUTHORS WHERE id = ANY(${ids})`;
	console.timeEnd("Select benchmark authors");

	// Complex analytical query (using TimescaleDB continuous aggregates)
	console.time("Complex analytical query (TimescaleDB)");
	await complexAnalyticalQueryTimescale();
	console.timeEnd("Complex analytical query (TimescaleDB)");

	// Standard complex analytical query (for comparison)
	console.time("Complex analytical query (Standard)");
	await complexAnalyticalQueryStandard();
	console.timeEnd("Complex analytical query (Standard)");

	// Aggregation query (using TimescaleDB continuous aggregates)
	console.time("Aggregation query (TimescaleDB)");
	await aggregationQueryTimescale();
	console.timeEnd("Aggregation query (TimescaleDB)");

	// Standard aggregation query (for comparison)
	console.time("Aggregation query (Standard)");
	await aggregationQueryStandard();
	console.timeEnd("Aggregation query (Standard)");

	// Time-series specific queries
	console.time("Hourly statistics query");
	await hourlyStatsQuery();
	console.timeEnd("Hourly statistics query");

	console.time("Real-time stats query");
	await realtimeStatsQuery();
	console.timeEnd("Real-time stats query");

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
		await sql.begin(async (sql) => {
			for (let batch = 0; batch < batches; batch++) {
				const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

				const values = [];
				const now = new Date();

				for (let i = 0; i < currentBatchSize; i++) {
					const firstName = escape(faker.person.firstName());
					const lastName = escape(faker.person.lastName());

					// Spread data across time for better time-series demonstration
					const createdAt = new Date(
						now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000,
					); // Last 30 days

					values.push({
						id: randomUUID(),
						first_name: firstName,
						last_name: lastName,
						email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
						created_at: createdAt.toISOString(),
					});
				}

				await sql`INSERT INTO authors ${sql(values)}`;

				if ((batch + 1) % 10 === 0) {
					console.log(
						`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records`,
					);
				}
			}
		});

		console.log("✅ Bulk insert completed successfully");
		console.log("📊 Continuous aggregates will be updated automatically");
	} catch (error) {
		console.error("❌ Bulk insert failed:", error);
		throw error;
	}
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID());
	const now = new Date();

	// Use bulk insert for better performance
	const values = ids.map((id, index) => {
		const firstName = escape(faker.person.firstName());
		const lastName = escape(faker.person.lastName());

		// Spread inserts across last few hours for time-series effect
		const createdAt = new Date(now.getTime() - index * 1000); // 1 second apart

		return {
			id,
			first_name: firstName,
			last_name: lastName,
			email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
			created_at: createdAt.toISOString(),
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

async function complexAnalyticalQueryTimescale() {
	// Query using continuous aggregates (much faster for time-based analytics)
	const result = await sql`
		SELECT
			first_letter,
			SUM(author_count) as total_count,
			AVG(avg_name_length) as avg_name_length,
			MIN(min_lastname_length) as min_lastname_length,
			MAX(max_lastname_length) as max_lastname_length
		FROM author_daily_analytics
		WHERE day_bucket >= NOW() - INTERVAL '30 days'
		GROUP BY first_letter
		HAVING SUM(author_count) > 10
		ORDER BY total_count DESC
		LIMIT 10
	`;
	return result;
}

async function complexAnalyticalQueryStandard() {
	// Standard query for comparison
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

async function aggregationQueryTimescale() {
	// Query using continuous aggregates (instant results)
	const result = await sql`
		SELECT
			SUM(authors_count) as total_authors,
			AVG(unique_first_names) as avg_unique_first_names,
			AVG(unique_last_names) as avg_unique_last_names,
			AVG(avg_first_name_length) as avg_first_name_length,
			AVG(avg_last_name_length) as avg_last_name_length
		FROM author_hourly_stats
		WHERE hour_bucket >= NOW() - INTERVAL '24 hours'
	`;
	return result;
}

async function aggregationQueryStandard() {
	// Standard query for comparison
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

async function hourlyStatsQuery() {
	// TimescaleDB-specific query for hourly trends
	const result = await sql`
		SELECT
			hour_bucket,
			authors_count,
			unique_first_names,
			avg_first_name_length
		FROM author_hourly_stats
		WHERE hour_bucket >= NOW() - INTERVAL '24 hours'
		ORDER BY hour_bucket DESC
		LIMIT 24
	`;
	return result;
}

async function realtimeStatsQuery() {
	// Real-time statistics (5-minute buckets)
	const result = await sql`
		SELECT
			time_bucket,
			total_authors,
			unique_first_names,
			unique_last_names
		FROM author_realtime_stats
		WHERE time_bucket >= NOW() - INTERVAL '2 hours'
		ORDER BY time_bucket DESC
		LIMIT 24
	`;
	return result;
}

async function refreshContinuousAggregates() {
	try {
		console.log("🔄 Manually refreshing continuous aggregates...");

		await sql.unsafe(
			`CALL refresh_continuous_aggregate('author_hourly_stats', NULL, NULL)`,
		);
		await sql.unsafe(
			`CALL refresh_continuous_aggregate('author_daily_analytics', NULL, NULL)`,
		);
		await sql.unsafe(
			`CALL refresh_continuous_aggregate('author_realtime_stats', NULL, NULL)`,
		);

		console.log("✅ Continuous aggregates refreshed");
	} catch (error) {
		console.log("⚠️ Could not refresh continuous aggregates:", error);
	}
}

async function getDatabaseSize(): Promise<number> {
	const result = await sql`SELECT COUNT(*) as count FROM authors`;
	return Number(result[0].count);
}
