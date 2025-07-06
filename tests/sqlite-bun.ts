import { Database } from "bun:sqlite"
import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "./utilities/escape"
import { randomUUID } from "crypto"

const db = new Database("test_large_bun.db", { create: true })

const BENCHMARK_COUNT = 2048
const BULK_DATA_COUNT = 1_000_000 // 1 million records

main()

function getMemoryUsage() {
	const usage = process.memoryUsage()
	return {
		rss: Math.round(usage.rss / 1024 / 1024), // MB
		heapUsed: Math.round(usage.heapUsed / 1024 / 1024), // MB
		heapTotal: Math.round(usage.heapTotal / 1024 / 1024), // MB
		external: Math.round(usage.external / 1024 / 1024), // MB
	}
}

async function main() {
	await initSQL()

	console.log("=".repeat(60))
	console.log("🧪 SQLite (Bun) Performance Benchmark")
	console.log("=".repeat(60))

	// Run benchmark with empty database
	console.log("\n📊 PHASE 1: Benchmark with empty database")
	console.log("Memory before:", getMemoryUsage())
	await runBenchmark("EMPTY DB")

	// Add bulk data
	console.log("\n📦 PHASE 2: Loading bulk data...")
	console.log(`Adding ${BULK_DATA_COUNT.toLocaleString()} records...`)
	console.time("Bulk data insert")
	await insertBulkData(BULK_DATA_COUNT)
	console.timeEnd("Bulk data insert")

	// Check database size
	const count = getDatabaseSize()
	console.log(`Database now contains ${count.toLocaleString()} total records`)
	console.log("Memory after bulk insert:", getMemoryUsage())

	// Run benchmark with populated database
	console.log("\n📊 PHASE 3: Benchmark with populated database")
	await runBenchmark("POPULATED DB")

	console.log("\n🏁 Benchmark complete!")
	db.close()
}

async function initSQL() {
	db.exec("PRAGMA journal_mode = WAL")
	db.exec("PRAGMA synchronous = NORMAL")
	db.exec("PRAGMA cache_size = 10000")
	db.exec("PRAGMA temp_store = MEMORY")

	db.exec(`DROP TABLE IF EXISTS BOOKS`)
	db.exec(`DROP TABLE IF EXISTS authors`)
	
	db.exec(`CREATE TABLE authors (
		id TEXT PRIMARY KEY, 
		first_name TEXT,
		last_name TEXT,
		email TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)
	
	db.exec(`CREATE TABLE BOOKS (
		id TEXT PRIMARY KEY,
		title TEXT,
		author TEXT REFERENCES authors(id),
		isbn TEXT,
		price INTEGER,
		publication_year INTEGER,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`)

	// Create indexes for better performance
	db.exec(`CREATE INDEX idx_authors_name ON authors(first_name, last_name)`)
	db.exec(`CREATE INDEX idx_books_author ON BOOKS(author)`)
	db.exec(`CREATE INDEX idx_books_year ON BOOKS(publication_year)`)
}

async function runBenchmark(phase: string) {
	console.log(`\n--- ${phase} BENCHMARK ---`)
	
	const memBefore = getMemoryUsage()
	
	// Insert benchmark records
	const stage = `Insert ${BENCHMARK_COUNT} authors`
	console.time(stage)
	const ids = await insertAuthors(BENCHMARK_COUNT)
	console.timeEnd(stage)

	// Pick individual records
	console.time("Pick authors")
	await pickAuthors(ids)
	console.timeEnd("Pick authors")

	// Select all benchmark records
	console.time("Select benchmark authors")
	const placeholders = ids.map(() => '?').join(',')
	db.query(`SELECT * FROM authors WHERE id IN (${placeholders})`).all(...ids)
	console.timeEnd("Select benchmark authors")

	// Complex analytical query
	console.time("Complex analytical query")
	await complexAnalyticalQuery()
	console.timeEnd("Complex analytical query")

	// Aggregation query
	console.time("Aggregation query")
	await aggregationQuery()
	console.timeEnd("Aggregation query")

	const memAfter = getMemoryUsage()
	console.log(`Memory usage - Before: ${memBefore.rss}MB, After: ${memAfter.rss}MB, Diff: ${memAfter.rss - memBefore.rss}MB`)
}

async function insertBulkData(count: number) {
	const batchSize = 10000
	const batches = Math.ceil(count / batchSize)
	
	console.log(`Inserting ${count.toLocaleString()} records in ${batches} batches of ${batchSize.toLocaleString()}...`)

	// Use transaction for better performance
	const transaction = db.transaction(() => {
		const insertQuery = db.prepare(
			`INSERT INTO authors (id, first_name, last_name, email) VALUES (?, ?, ?, ?)`
		)

		for (let batch = 0; batch < batches; batch++) {
			const currentBatchSize = Math.min(batchSize, count - batch * batchSize)
			
			for (let i = 0; i < currentBatchSize; i++) {
				const firstName = escape(faker.person.firstName())
				const lastName = escape(faker.person.lastName())
				
				insertQuery.run(
					randomUUID(),
					firstName,
					lastName,
					`${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
				)
			}

			if ((batch + 1) % 10 === 0) {
				console.log(`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records`)
			}
		}
	})

	try {
		transaction()
		console.log("✅ Bulk insert completed successfully")
	} catch (error) {
		console.error("❌ Bulk insert failed:", error)
		throw error
	}
}

const insertAuthorsQuery = db.prepare(
	`INSERT INTO authors (id, first_name, last_name, email) VALUES (?, ?, ?, ?)`
)

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => randomUUID())

	const transaction = db.transaction(() => {
		for (const id of ids) {
			const firstName = escape(faker.person.firstName())
			const lastName = escape(faker.person.lastName())
			
			insertAuthorsQuery.run(
				id,
				firstName,
				lastName,
				`${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`
			)
		}
	})

	transaction()
	return ids
}

const pickAuthorQuery = db.prepare(`SELECT * FROM authors WHERE id = ?`)

async function pickAuthors(ids: string[]) {
	for (const id of ids) {
		pickAuthorQuery.get(id)
	}
}

async function complexAnalyticalQuery() {
	db.query(`
		SELECT 
			SUBSTR(first_name, 1, 1) as first_letter,
			COUNT(*) as author_count,
			AVG(LENGTH(first_name || ' ' || last_name)) as avg_name_length,
			MIN(LENGTH(last_name)) as min_lastname_length,
			MAX(LENGTH(last_name)) as max_lastname_length
		FROM authors 
		WHERE LENGTH(first_name) > 3
		GROUP BY SUBSTR(first_name, 1, 1)
		HAVING COUNT(*) > 10
		ORDER BY author_count DESC
		LIMIT 10
	`).all()
}

async function aggregationQuery() {
	db.query(`
		SELECT 
			COUNT(*) as total_authors,
			COUNT(DISTINCT first_name) as unique_first_names,
			COUNT(DISTINCT last_name) as unique_last_names,
			AVG(LENGTH(first_name)) as avg_first_name_length,
			AVG(LENGTH(last_name)) as avg_last_name_length
		FROM authors
	`).get()
}

function getDatabaseSize(): number {
	const result = db.query(`SELECT COUNT(*) as count FROM authors`).get() as { count: number }
	return result.count
}