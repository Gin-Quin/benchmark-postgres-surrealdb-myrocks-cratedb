# Postgres

bun run .\tests\postgres.ts          
============================================================
🧪 PostgreSQL Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 321,
  heapUsed: 16,
  heapTotal: 17,
  external: 6,
}

--- EMPTY DB BENCHMARK ---
[122.97ms] Insert 2048 authors
[68.90ms] Pick authors
[6.14ms] Select benchmark authors
[2.75ms] Complex analytical query
[4.30ms] Aggregation query
Memory usage - Before: 321MB, After: 353MB, Diff: 32MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
[13.63s] Bulk data insert
Database now contains 1 002 048 total records
Memory after bulk insert: {
  rss: 440,
  heapUsed: 39,
  heapTotal: 38,
  external: 24,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[42.58ms] Insert 2048 authors
[37.49ms] Pick authors
[56.73ms] Select benchmark authors
[341.91ms] Complex analytical query
[1362.76ms] Aggregation query
Memory usage - Before: 440MB, After: 441MB, Diff: 1MB

🏁 Benchmark complete!


# Timescale

bun run .\tests\postgres_timescale.ts
🔧 Initializing PostgreSQL with TimescaleDB extension...
✅ TimescaleDB extension loaded
🕰️ Converting AUTHORS table to hypertable...
📊 Creating continuous aggregates...
⚙️ Adding continuous aggregate refresh policies...
✅ TimescaleDB continuous aggregates created successfully
============================================================
🧪 PostgreSQL TimescaleDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 309,
  heapUsed: 16,
  heapTotal: 18,
  external: 6,
}

--- EMPTY DB BENCHMARK ---
[119.92ms] Insert 2048 authors
[86.48ms] Pick authors
[9.52ms] Select benchmark authors
[4.35ms] Complex analytical query (TimescaleDB)
[5.12ms] Complex analytical query (Standard)
[3.49ms] Aggregation query (TimescaleDB)
[4.79ms] Aggregation query (Standard)
[3.20ms] Hourly statistics query
[2.87ms] Real-time stats query
Memory usage - Before: 309MB, After: 343MB, Diff: 34MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
📊 Continuous aggregates will be updated automatically
[123.90s] Bulk data insert
Database now contains 1 002 048 total records
Memory after bulk insert: {
  rss: 406,
  heapUsed: 21,
  heapTotal: 25,
  external: 7,
}

⏳ Waiting for continuous aggregates to refresh...
🔄 Manually refreshing continuous aggregates...
✅ Continuous aggregates refreshed

📊 PHASE 3: Benchmark with populated database

🔄 Manually refreshing continuous aggregates...
✅ Continuous aggregates refreshed

🔄 Manually refreshing continuous aggregates...
✅ Continuous aggregates refreshed
🔄 Manually refreshing continuous aggregates...
🔄 Manually refreshing continuous aggregates...
🔄 Manually refreshing continuous aggregates...
✅ Continuous aggregates refreshed

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[96.69ms] Insert 2048 authors
[17.91s] Pick authors
[800.08ms] Select benchmark authors
--- POPULATED DB BENCHMARK ---
[96.69ms] Insert 2048 authors
[17.91s] Pick authors
[800.08ms] Select benchmark authors
[32.10ms] Complex analytical query (TimescaleDB)
[551.41ms] Complex analytical query (Standard)
[6.57ms] Aggregation query (TimescaleDB)
[32.10ms] Complex analytical query (TimescaleDB)
[551.41ms] Complex analytical query (Standard)
[6.57ms] Aggregation query (TimescaleDB)
[1207.82ms] Aggregation query (Standard)
[5.98ms] Hourly statistics query
[4.33ms] Real-time stats query
Memory usage - Before: 406MB, After: 409MB, Diff: 3MB
[1207.82ms] Aggregation query (Standard)
[5.98ms] Hourly statistics query
[4.33ms] Real-time stats query
Memory usage - Before: 406MB, After: 409MB, Diff: 3MB

🏁 Benchmark complete!


# SurrealDB

bun run .\tests\surreal.ts
============================================================
🧪 SurrealDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 293,
📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 293,
  heapUsed: 14,
  heapTotal: 16,
  external: 5,
}

--- EMPTY DB BENCHMARK ---
[62.22ms] Insert 2048 authors
[189.01ms] Pick authors
  heapUsed: 14,
  heapTotal: 16,
  external: 5,
}

--- EMPTY DB BENCHMARK ---
[62.22ms] Insert 2048 authors
[189.01ms] Pick authors
[320.61ms] Select benchmark authors
[10.53ms] Complex analytical query
[10.94ms] Aggregation query
Memory usage - Before: 293MB, After: 308MB, Diff: 15MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
[320.61ms] Select benchmark authors
[10.53ms] Complex analytical query
[10.94ms] Aggregation query
Memory usage - Before: 293MB, After: 308MB, Diff: 15MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
✅ Bulk insert completed successfully
✅ Bulk insert completed successfully
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[80.12ms] Insert 2048 authors
[201.61ms] Pick authors
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[80.12ms] Insert 2048 authors
[201.61ms] Pick authors



✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[80.12ms] Insert 2048 authors
[201.61ms] Pick authors

✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}
✅ Bulk insert completed successfully
[30.44s] Bulk data insert
Database now contains 0 total records
Memory after bulk insert: {
  rss: 476,
  rss: 476,
  heapUsed: 66,
  heapTotal: 80,
  external: 21,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[80.12ms] Insert 2048 authors
[201.61ms] Pick authors
[173.03s] Select benchmark authors
[50.95ms] Complex analytical query
[5.21s] Aggregation query
Memory usage - Before: 476MB, After: 505MB, Diff: 29MB

🏁 Benchmark complete!


# SQLite

bun run .\tests\sqlite-bun.ts
============================================================
🧪 SQLite (Bun) Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 315,
  heapUsed: 0,
  heapTotal: 17,
  external: 0,
}

--- EMPTY DB BENCHMARK ---
[17.48ms] Insert 2048 authors
[7.51ms] Pick authors
[3.72ms] Select benchmark authors
[1.36ms] Complex analytical query
[1.05ms] Aggregation query
Memory usage - Before: 315MB, After: 325MB, Diff: 10MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
[10.32s] Bulk data insert
Database now contains 1 002 048 total records
Memory after bulk insert: {
  rss: 366,
  heapUsed: 15,
  heapTotal: 50,
  external: 5,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[187.52ms] Insert 2048 authors
[11.19ms] Pick authors
[4.81ms] Select benchmark authors
[548.97ms] Complex analytical query
[255.91ms] Aggregation query
Memory usage - Before: 366MB, After: 363MB, Diff: -3MB

🏁 Benchmark complete!


# LevelDB

bun run .\tests\levelup.ts
============================================================
🧪 LevelDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 147,
  heapUsed: 0,
  heapTotal: 2,
  external: 0,
}

--- EMPTY DB BENCHMARK ---
[48.38ms] Insert 2048 key-value pairs
[16.43ms] Pick key-value pairs
PS C:\Users\Mad Mat\code\benchmark-postgres-surrealdb-myrocks-cratedb> bun run .\tests\levelup.ts
============================================================
🧪 LevelDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 147,
  heapUsed: 0,
  heapTotal: 2,
  external: 0,
}

--- EMPTY DB BENCHMARK ---
[48.38ms] Insert 2048 key-value pairs
[16.43ms] Pick key-value pairs
  heapUsed: 0,
  heapTotal: 2,
  external: 0,
}

--- EMPTY DB BENCHMARK ---
[48.38ms] Insert 2048 key-value pairs
[16.43ms] Pick key-value pairs
[48.38ms] Insert 2048 key-value pairs
[16.43ms] Pick key-value pairs
[16.43ms] Pick key-value pairs
[9.19ms] Batch get operation
[13.30ms] Range scan (first 1000)
[0.98ms] Key existence check
[0.98ms] Key existence check
Memory usage - Before: 147MB, After: 243MB, Diff: 96MB
Memory usage - Before: 147MB, After: 243MB, Diff: 96MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
[29.30s] Bulk data insert
Database now contains ~1 000 000 + 2048 total records
Memory after bulk insert: {
  rss: 357,
  heapUsed: 22,
  heapTotal: 50,
  external: 2,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[20.07ms] Insert 2048 key-value pairs
[12.31ms] Pick key-value pairs
[9.87ms] Batch get operation
[5.80ms] Range scan (first 1000)
[0.65ms] Key existence check
Memory usage - Before: 357MB, After: 376MB, Diff: 19MB

🏁 Benchmark complete!


# LMDB

bun tsx .\tests\lmdb.ts
============================================================
🧪 LMDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: { rss: 52, heapUsed: 9, heapTotal: 18, external: 1 }

--- EMPTY DB BENCHMARK ---
Insert 2048 key-value pairs: 226.169ms
Pick key-value pairs: 9.984ms
Batch get operation: 4.144ms
Range scan (first 1000): 8.118ms
Key existence check: 0.634ms
Memory usage - Before: 52MB, After: 78MB, Diff: 26MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
Bulk data insert: 48.658s
Database now contains ~1 000 000 + 2048 total records
Memory after bulk insert: { rss: 1986, heapUsed: 10, heapTotal: 51, external: 1 }

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
Insert 2048 key-value pairs: 42.136ms
Pick key-value pairs: 6.014ms
Batch get operation: 4.594ms
Range scan (first 1000): 2.69ms
Key existence check: 0.198ms
Memory usage - Before: 1986MB, After: 1992MB, Diff: 6MB

🏁 Benchmark complete!


# DuckDB

bun run .\tests\duckdb.ts
============================================================
🧪 DuckDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
  rss: 309,
  heapUsed: 15,
  heapTotal: 18,
  external: 5,
}

--- EMPTY DB BENCHMARK ---
[5.24s] Insert 2048 authors
[495.69ms] Pick authors
[41.99ms] Select benchmark authors
[3.09ms] Complex analytical query
[1.13ms] Aggregation query
Memory usage - Before: 309MB, After: 420MB, Diff: 111MB

📦 PHASE 2: Loading bulk data...
Adding 1 000 000 records...
Inserting 1 000 000 records in 100 batches of 10 000...
  Completed 100 000 / 1 000 000 records
  Completed 200 000 / 1 000 000 records
  Completed 300 000 / 1 000 000 records
  Completed 400 000 / 1 000 000 records
  Completed 500 000 / 1 000 000 records
  Completed 600 000 / 1 000 000 records
  Completed 700 000 / 1 000 000 records
  Completed 800 000 / 1 000 000 records
  Completed 900 000 / 1 000 000 records
  Completed 1 000 000 / 1 000 000 records
✅ Bulk insert completed successfully
[348.42s] Bulk data insert
Database now contains 1 002 048 total records
Memory after bulk insert: {
  rss: 392,
  heapUsed: 15,
  heapTotal: 23,
  external: 4,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[5.47s] Insert 2048 authors
[589.57ms] Pick authors
[48.45ms] Select benchmark authors
[28.79ms] Complex analytical query
[11.92ms] Aggregation query
Memory usage - Before: 392MB, After: 565MB, Diff: 173MB

🏁 Benchmark complete!
