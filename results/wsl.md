# DuckDB

# bun run tests/duckdb.ts

# 🧪 DuckDB Performance Benchmark

📊 PHASE 1: Benchmark with empty database
Memory before: {
rss: 219,
heapUsed: 15,
heapTotal: 18,
external: 5,
}

--- EMPTY DB BENCHMARK ---
[10.63s] Insert 2048 authors
[657.14ms] Pick authors
[35.06ms] Select benchmark authors
[2.72ms] Complex analytical query
[1.62ms] Aggregation query
Memory usage - Before: 219MB, After: 276MB, Diff: 57MB

📦 PHASE 2: Loading bulk data...
Adding 1,000,000 records...
Inserting 1,000,000 records in 100 batches of 10,000...
Completed 100,000 / 1,000,000 records
Completed 200,000 / 1,000,000 records
Completed 300,000 / 1,000,000 records
Completed 400,000 / 1,000,000 records
Completed 500,000 / 1,000,000 records
Completed 600,000 / 1,000,000 records
Completed 700,000 / 1,000,000 records
Completed 800,000 / 1,000,000 records
Completed 900,000 / 1,000,000 records
Completed 1,000,000 / 1,000,000 records
✅ Bulk insert completed successfully
[489.82s] Bulk data insert
Database now contains 1,002,048 total records
Memory after bulk insert: {
rss: 494,
heapUsed: 15,
heapTotal: 17,
external: 5,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[10.99s] Insert 2048 authors
[719.80ms] Pick authors
[37.25ms] Select benchmark authors
[32.40ms] Complex analytical query
[9.45ms] Aggregation query
Memory usage - Before: 494MB, After: 526MB, Diff: 32MB

🏁 Benchmark complete!

# SQLite

# bun run tests/sqlite-bun.ts

# 🧪 SQLite (Bun) Performance Benchmark

📊 PHASE 1: Benchmark with empty database
Memory before: {
rss: 142,
heapUsed: 0,
heapTotal: 17,
external: 0,
}

--- EMPTY DB BENCHMARK ---
[18.43ms] Insert 2048 authors
[9.22ms] Pick authors
[4.10ms] Select benchmark authors
[1.07ms] Complex analytical query
[0.90ms] Aggregation query
Memory usage - Before: 142MB, After: 153MB, Diff: 11MB

📦 PHASE 2: Loading bulk data...
Adding 1,000,000 records...
Inserting 1,000,000 records in 100 batches of 10,000...
Completed 100,000 / 1,000,000 records
Completed 200,000 / 1,000,000 records
Completed 300,000 / 1,000,000 records
Completed 400,000 / 1,000,000 records
Completed 500,000 / 1,000,000 records
Completed 600,000 / 1,000,000 records
Completed 700,000 / 1,000,000 records
Completed 800,000 / 1,000,000 records
Completed 900,000 / 1,000,000 records
Completed 1,000,000 / 1,000,000 records
✅ Bulk insert completed successfully
[12.05s] Bulk data insert
Database now contains 1,002,048 total records
Memory after bulk insert: {
rss: 217,
heapUsed: 15,
heapTotal: 50,
external: 5,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[123.27ms] Insert 2048 authors
[11.72ms] Pick authors
[4.94ms] Select benchmark authors
[485.28ms] Complex analytical query
[284.62ms] Aggregation query
Memory usage - Before: 217MB, After: 265MB, Diff: 48MB

🏁 Benchmark complete!

# LMDB

# bun run tests/lmdb.ts

# 🧪 LMDB Performance Benchmark

📊 PHASE 1: Benchmark with empty database
Memory before: {
rss: 65,
heapUsed: 0,
heapTotal: 3,
external: 0,
}

--- EMPTY DB BENCHMARK ---
[43.57ms] Insert 2048 key-value pairs
[5.88ms] Pick key-value pairs
[3.85ms] Batch get operation
[4.69ms] Range scan (first 1000)
[0.46ms] Key existence check
Memory usage - Before: 65MB, After: 95MB, Diff: 30MB

📦 PHASE 2: Loading bulk data...
Adding 1,000,000 records...
Inserting 1,000,000 records in 100 batches of 10,000...
Completed 100,000 / 1,000,000 records
Completed 200,000 / 1,000,000 records
Completed 300,000 / 1,000,000 records
Completed 400,000 / 1,000,000 records
Completed 500,000 / 1,000,000 records
Completed 600,000 / 1,000,000 records
Completed 700,000 / 1,000,000 records
Completed 800,000 / 1,000,000 records
Completed 900,000 / 1,000,000 records
Completed 1,000,000 / 1,000,000 records
✅ Bulk insert completed successfully
[7.21s] Bulk data insert
Database now contains ~1,000,000 + 2048 total records
Memory after bulk insert: {
rss: 171,
heapUsed: 21,
heapTotal: 29,
external: 11,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[26.72ms] Insert 2048 key-value pairs
[5.76ms] Pick key-value pairs
[5.29ms] Batch get operation
[3.94ms] Range scan (first 1000)
[0.38ms] Key existence check
Memory usage - Before: 171MB, After: 189MB, Diff: 18MB

🏁 Benchmark complete!

# Postgres

# bun run tests/postgres

# 🧪 PostgreSQL Performance Benchmark

📊 PHASE 1: Benchmark with empty database
Memory before: {
rss: 150,
heapUsed: 16,
heapTotal: 18,
external: 6,
}

--- EMPTY DB BENCHMARK ---
[48.88ms] Insert 2048 authors
[57.46ms] Pick authors
[7.24ms] Select benchmark authors
[6.57ms] Complex analytical query
[3.96ms] Aggregation query
Memory usage - Before: 150MB, After: 171MB, Diff: 21MB

📦 PHASE 2: Loading bulk data...
Adding 1,000,000 records...
Inserting 1,000,000 records in 100 batches of 10,000...
Completed 100,000 / 1,000,000 records
Completed 200,000 / 1,000,000 records
Completed 300,000 / 1,000,000 records
Completed 400,000 / 1,000,000 records
Completed 500,000 / 1,000,000 records
Completed 600,000 / 1,000,000 records
Completed 700,000 / 1,000,000 records
Completed 800,000 / 1,000,000 records
Completed 900,000 / 1,000,000 records
Completed 1,000,000 / 1,000,000 records
✅ Bulk insert completed successfully
[13.25s] Bulk data insert
Database now contains 1,002,048 total records
Memory after bulk insert: {
rss: 193,
heapUsed: 26,
heapTotal: 39,
external: 11,
}

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[46.00ms] Insert 2048 authors
[31.03ms] Pick authors
[19.07ms] Select benchmark authors
[127.88ms] Complex analytical query
[1228.78ms] Aggregation query
Memory usage - Before: 193MB, After: 171MB, Diff: -22MB

🏁 Benchmark complete!

# TimescaleDB

============================================================
🧪 PostgreSQL TimescaleDB Performance Benchmark
============================================================

📊 PHASE 1: Benchmark with empty database
Memory before: {
rss: 133,
heapUsed: 16,
heapTotal: 17,
external: 6,
}

--- EMPTY DB BENCHMARK ---
[83.15ms] Insert 2048 authors
[78.58ms] Pick authors
[9.97ms] Select benchmark authors
[7.61ms] Complex analytical query (TimescaleDB)
[5.55ms] Complex analytical query (Standard)
[3.05ms] Aggregation query (TimescaleDB)
[4.47ms] Aggregation query (Standard)
[2.80ms] Hourly statistics query
[1.25ms] Real-time stats query
Memory usage - Before: 133MB, After: 158MB, Diff: 25MB

📦 PHASE 2: Loading bulk data...
Adding 1,000,000 records...
Inserting 1,000,000 records in 100 batches of 10,000...
Completed 100,000 / 1,000,000 records
Completed 200,000 / 1,000,000 records
Completed 300,000 / 1,000,000 records
Completed 400,000 / 1,000,000 records
Completed 500,000 / 1,000,000 records
Completed 600,000 / 1,000,000 records
Completed 700,000 / 1,000,000 records
Completed 800,000 / 1,000,000 records
Completed 900,000 / 1,000,000 records
Completed 1,000,000 / 1,000,000 records
✅ Bulk insert completed successfully
📊 Continuous aggregates will be updated automatically
[128.59s] Bulk data insert
Database now contains 1,002,048 total records
Memory after bulk insert: {
rss: 156,
heapUsed: 21,
heapTotal: 23,
external: 8,
}

⏳ Waiting for continuous aggregates to refresh...
🔄 Manually refreshing continuous aggregates...
✅ Continuous aggregates refreshed

📊 PHASE 3: Benchmark with populated database

--- POPULATED DB BENCHMARK ---
[56.30ms] Insert 2048 authors
[15.44s] Pick authors
[765.43ms] Select benchmark authors
[26.58ms] Complex analytical query (TimescaleDB)
[533.20ms] Complex analytical query (Standard)
[6.57ms] Aggregation query (TimescaleDB)
[1237.02ms] Aggregation query (Standard)
[5.39ms] Hourly statistics query
[3.68ms] Real-time stats query
Memory usage - Before: 155MB, After: 149MB, Diff: -6MB

🏁 Benchmark complete!
