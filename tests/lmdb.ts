import { open as openLMDB } from "lmdb";
import { randomUUID, randomBytes } from "node:crypto";

const db = openLMDB({
	path: "./lmdb_large.db",
	compression: true,
	mapSize: 1024 * 1024 * 1024,
	encoding: "binary",
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
	console.log("=".repeat(60));
	console.log("🧪 LMDB Performance Benchmark");
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

	// Check database size (approximate)
	console.log(
		`Database now contains ~${BULK_DATA_COUNT.toLocaleString()} + ${BENCHMARK_COUNT} total records`,
	);
	console.log("Memory after bulk insert:", getMemoryUsage());

	// Run benchmark with populated database
	console.log("\n📊 PHASE 3: Benchmark with populated database");
	await runBenchmark("POPULATED DB");

	console.log("\n🏁 Benchmark complete!");
	await db.close();
}

async function runBenchmark(phase: string) {
	console.log(`\n--- ${phase} BENCHMARK ---`);

	const memBefore = getMemoryUsage();

	// Insert benchmark records
	const stage = `Insert ${BENCHMARK_COUNT} key-value pairs`;
	console.time(stage);
	const ids = await insertAuthors(BENCHMARK_COUNT);
	console.timeEnd(stage);

	// Pick individual records
	console.time("Pick key-value pairs");
	await pickAuthors(ids);
	console.timeEnd("Pick key-value pairs");

	// Batch get operation
	console.time("Batch get operation");
	await batchGetAuthors(ids);
	console.timeEnd("Batch get operation");

	// Range scan operation
	console.time("Range scan (first 1000)");
	await rangeScan(1000);
	console.timeEnd("Range scan (first 1000)");

	// Key existence check
	console.time("Key existence check");
	await keyExistenceCheck(ids.slice(0, 100));
	console.timeEnd("Key existence check");

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

	const content = randomBytes(1024); // 1KB per record

	for (let batch = 0; batch < batches; batch++) {
		const currentBatchSize = Math.min(batchSize, count - batch * batchSize);

		const promises = [];
		for (let i = 0; i < currentBatchSize; i++) {
			const key = `bulk_${batch}_${i}_${randomUUID()}`;
			promises.push(db.put(key, content));
		}

		await Promise.all(promises);

		if ((batch + 1) % 10 === 0) {
			console.log(
				`  Completed ${((batch + 1) * batchSize).toLocaleString()} / ${count.toLocaleString()} records`,
			);
		}
	}

	console.log("✅ Bulk insert completed successfully");
}

async function insertAuthors(count: number) {
	const ids = new Array(count).fill(0).map(() => `benchmark_${randomUUID()}`);
	const content = randomBytes(1024); // 1KB per record

	const queries = ids.map(async (id) => {
		await db.put(id, content);
		return id;
	});

	return await Promise.all(queries);
}

async function pickAuthors(ids: string[]) {
	await Promise.all(
		ids.map(async (id) => {
			const result = await db.get(id);
			return result;
		}),
	);
}

async function batchGetAuthors(ids: string[]) {
	// Simulate batch operation with chunked gets
	const chunkSize = 100;
	const chunks = [];

	for (let i = 0; i < ids.length; i += chunkSize) {
		chunks.push(ids.slice(i, i + chunkSize));
	}

	for (const chunk of chunks) {
		await Promise.all(chunk.map((id) => db.get(id)));
	}
}

async function rangeScan(limit: number) {
	// Use LMDB's getRange for efficient range scanning
	let count = 0;
	const stream = db.getRange();

	for await (const { key, value } of stream) {
		count++;
		if (count >= limit) {
			break;
		}
	}
}

async function keyExistenceCheck(ids: string[]) {
	// Check if keys exist by attempting to get them
	const promises = ids.map(async (id) => {
		try {
			const result = await db.get(id);
			return result !== undefined;
		} catch {
			return false;
		}
	});
	await Promise.all(promises);
}
