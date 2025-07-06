# Results on M4 Chip

## Empty Database Performance Comparison

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **SQLite (Bun)** | 7.79ms | 7.05ms | 1.97ms | 0.65ms | 0.66ms |
| **LMDB** | 15.91ms | 3.98ms | - | - | - |
| **LevelDB** | 16.94ms | 3.84ms | - | - | - |
| **PostgreSQL** | 29.23ms | 26.35ms | 2.88ms | 1.63ms | 3.77ms |
| **SurrealDB** | 37.86ms | 44.04ms | 159.73ms | 6.09ms | 6.28ms |
| **TimescaleDB** | 40.42ms | 35.62ms | 3.44ms | 1.18ms | 1.25ms |
| **DuckDB** | 353.60ms | 137.12ms | 12.25ms | 1.59ms | 0.45ms |

## Bulk Insert Performance Comparison

| Database | Time (1M records) | Records/sec | Ranking |
|----------|-------------------|-------------|---------|
| **LMDB** | 1.99s | ~502,500 | 🥇 1st |
| **SQLite (Bun)** | 3.46s | ~289,000 | 🥈 2nd |
| **LevelDB** | 5.72s | ~174,800 | 🥉 3rd |
| **PostgreSQL** | 7.12s | ~140,400 | 4th |
| **SurrealDB** | 12.58s | ~79,500 | 5th |
| **TimescaleDB** | 31.41s | ~31,800 | 6th |
| **DuckDB** | 73.07s | ~13,700 | 7th |

## Populated Database Performance Comparison (1M+ records)

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **LMDB** | 8.09ms | 2.31ms | - | - | - |
| **LevelDB** | 10.92ms | 2.28ms | - | - | - |
| **SurrealDB** | 30.40ms | 37.70ms | 76.08s | 5.60ms | 966.01ms |
| **TimescaleDB** | 31.14ms | 8.47s | 294.91ms | 5.62ms | 2.27ms |
| **PostgreSQL** | 66.46ms | 20.77ms | 7.57ms | 76.62ms | 1038.57ms |
| **SQLite (Bun)** | 77.18ms | 10.27ms | 2.96ms | 272.58ms | 188.97ms |
| **DuckDB** | 377.46ms | 148.01ms | 13.62ms | 19.32ms | 6.06ms |

## Memory Usage Comparison

| Database | Starting Memory | Final Memory | Total Growth | Growth per 1M Records |
|----------|----------------|--------------|--------------|---------------------|
| **TimescaleDB** | 131MB | 177MB | 46MB | ~46MB |
| **SQLite (Bun)** | 169MB | 270MB | 101MB | ~101MB |
| **PostgreSQL** | 131MB | 247MB | 116MB | ~116MB |
| **LMDB** | 56MB | 219MB | 163MB | ~163MB |
| **LevelDB** | 37MB | 217MB | 180MB | ~180MB |
| **SurrealDB** | 128MB | 401MB | 273MB | ~273MB |
| **DuckDB** | 304MB | 682MB | 378MB | ~378MB |

## Database Size Comparison (Final Disk Usage)

| Database | Final Size | Ranking | Size Efficiency |
|----------|------------|---------|-----------------|
| **SQLite (Bun)** | 202 MB | 🥇 1st | Most compact |
| **LevelDB** | 379 MB | 🥈 2nd | Good compression |
| **DuckDB** | 392 MB | 🥉 3rd | Analytical optimized |
| **PostgreSQL** | 644 MB | 4th | Standard relational |
| **TimescaleDB** | 1.43 GB | 5th | Time-series overhead |
| **LMDB** | 1.93 GB | 6th | Memory-mapped trade-off |

### Key Insights:

**🏆 Performance Winners:**
- **Bulk Insert Champion**: LMDB - 502k records/sec (new champion!)
- **Small Operations Leader**: SQLite (Bun) - consistently fastest for small-scale operations
- **Memory Efficiency**: TimescaleDB - only 46MB growth per 1M records
- **Storage Efficiency**: SQLite (Bun) - most compact final size at 202MB
- **Analytical Queries**: DuckDB - specialized for analytics despite slower bulk operations
- **Key-Value Performance**: LMDB - exceptional performance for key-value operations

**⚠️ Notable Observations:**
- **LMDB** sets new performance records for bulk inserts and key-value operations, but uses most disk space
- **SQLite (Bun)** dominates in both performance and storage efficiency - the overall best choice for most use cases
- **LevelDB** excels at key-value operations with consistent performance and good compression
- **PostgreSQL** provides excellent balance of performance and SQL features with reasonable storage usage
- **TimescaleDB** shows specialized time-series optimization advantages but with storage overhead
- **SurrealDB** struggles with complex queries on large datasets
- **DuckDB** trades bulk insert speed for analytical query optimization with moderate storage usage

# Results & analysis per database

## DuckDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 353.60ms | 377.46ms | +31MB → +47MB |
| | Pick authors | 137.12ms | 148.01ms | |
| | Select benchmark authors | 12.25ms | 13.62ms | |
| | Complex analytical query | 1.59ms | 19.32ms | |
| | Aggregation query | 0.45ms | 6.06ms | |
| **Phase 2** | Bulk insert (1M records) | - | 73.07s | +300MB |

### Key Observations:
- **Memory efficient**: Started at 304MB, ended at 682MB after 1M+ records
- **Excellent analytical performance**: Sub-millisecond to low-millisecond complex queries on empty DB
- **Bulk insert performance**: 73 seconds for 1M records (≈13,700 records/sec)
- **Stability**: No crashes during intensive operations
- **Query degradation**: Analytical queries slow down with data volume (1.59ms → 19.32ms for complex queries)

## SQLite (Bun) Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 7.79ms | 77.18ms | +11MB → +40MB |
| | Pick authors | 7.05ms | 10.27ms | |
| | Select benchmark authors | 1.97ms | 2.96ms | |
| | Complex analytical query | 0.65ms | 272.58ms | |
| | Aggregation query | 0.66ms | 188.97ms | |
| **Phase 2** | Bulk insert (1M records) | - | 3.46s | +61MB |

### Key Observations:
- **Extremely fast bulk inserts**: 3.46 seconds for 1M records (≈289,000 records/sec) - 21x faster than DuckDB
- **Memory efficient**: Started at 169MB, ended at 270MB after 1M+ records
- **Excellent small-scale performance**: Sub-10ms for most operations on empty DB
- **Query performance degradation**: Significant slowdown for analytical queries with large datasets (0.65ms → 272.58ms)
- **Stability**: No crashes during intensive operations
- **Low memory overhead**: Only 101MB total memory growth for 1M+ records

## PostgreSQL TimescaleDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 40.42ms | 31.14ms | +25MB → +5MB |
| | Pick authors | 35.62ms | 8.47s | |
| | Select benchmark authors | 3.44ms | 294.91ms | |
| | Complex analytical query (TimescaleDB) | 1.18ms | 5.62ms | |
| | Complex analytical query (Standard) | 1.61ms | 258.43ms | |
| | Aggregation query (TimescaleDB) | 1.25ms | 2.27ms | |
| | Aggregation query (Standard) | 1.88ms | 757.66ms | |
| | Hourly statistics query | 0.73ms | 2.06ms | |
| | Real-time stats query | 0.72ms | 1.33ms | |
| **Phase 2** | Bulk insert (1M records) | - | 31.41s | +40MB |

### Key Observations:
- **TimescaleDB optimization**: Dramatic performance improvement with continuous aggregates (2.27ms vs 757.66ms for aggregation)
- **Bulk insert performance**: 31.41 seconds for 1M records (≈31,800 records/sec) - 2.3x faster than DuckDB
- **Memory efficient**: Started at 131MB, ended at 177MB after 1M+ records (46MB total growth)
- **Time-series queries**: Sub-millisecond to low-millisecond for specialized time-series operations
- **Standard query degradation**: Significant slowdown for non-optimized queries (35.62ms → 8.47s for pick authors)
- **Stability**: No crashes, though some status query issues (schema compatibility)
- **Continuous aggregates**: Automatic background processing for real-time analytics

## LevelDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 key-value pairs | 16.94ms | 10.92ms | +42MB → -5MB |
| | Pick key-value pairs | 3.84ms | 2.28ms | |
| | Batch get operation | 2.91ms | 3.15ms | |
| | Range scan (first 1000) | 2.98ms | 2.48ms | |
| | Key existence check | 0.25ms | 0.13ms | |
| **Phase 2** | Bulk insert (1M records) | - | 5.72s | +185MB |

### Key Observations:
- **Exceptional bulk insert performance**: 5.72 seconds for 1M records (≈174,800 records/sec) - 1.7x slower than SQLite but still excellent
- **Consistent performance**: Operations remain fast even with large datasets, some even improve
- **Memory efficient**: Started at 37MB, ended at 217MB after 1M+ records (180MB total growth)
- **Key-value optimization**: Excellent performance for key-value operations (sub-millisecond existence checks)
- **Stable performance**: No significant degradation with dataset size, unlike analytical databases
- **Range scanning**: Efficient streaming with createValueStream() for large dataset traversal
- **Memory cleanup**: Shows memory optimization during operations (negative diff in final phase)

## PostgreSQL Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 29.23ms | 66.46ms | +25MB → +1MB |
| | Pick authors | 26.35ms | 20.77ms | |
| | Select benchmark authors | 2.88ms | 7.57ms | |
| | Complex analytical query | 1.63ms | 76.62ms | |
| | Aggregation query | 3.77ms | 1038.57ms | |
| **Phase 2** | Bulk insert (1M records) | - | 7.12s | +115MB |

### Key Observations:
- **Excellent bulk insert performance**: 7.12 seconds for 1M records (≈140,400 records/sec) - 2nd fastest overall
- **Memory efficient**: Started at 131MB, ended at 247MB after 1M+ records (116MB total growth)
- **Strong analytical performance**: Excellent performance for complex queries on empty database
- **Transactional consistency**: Uses proper SQL transactions for data integrity
- **Moderate query degradation**: Performance decreases with dataset size but remains reasonable for most operations
- **Individual record access**: Good performance for picking individual records
- **Complex aggregations**: Significant slowdown for complex aggregations (3.77ms → 1038.57ms)
- **SQL maturity**: Benefits from decades of optimization and proper indexing strategies

## SurrealDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 37.86ms | 30.40ms | +14MB → +84MB |
| | Pick authors | 44.04ms | 37.70ms | |
| | Select benchmark authors | 159.73ms | 76.08s | |
| | Complex analytical query | 6.09ms | 5.60ms | |
| | Aggregation query | 6.28ms | 966.01ms | |
| **Phase 2** | Bulk insert (1M records) | - | 12.58s | +189MB |

### Key Observations:
- **Good bulk insert performance**: 12.58 seconds for 1M records (≈79,500 records/sec) - 2.2x faster than TimescaleDB
- **Memory intensive**: Started at 128MB, ended at 401MB after 1M+ records (273MB total growth)
- **Excellent small-scale performance**: Fast operations on empty database with good analytical query performance
- **Severe query degradation**: Dramatic slowdown for select operations with large datasets (159.73ms → 76.08s)
- **Mixed aggregation performance**: Simple queries fast, but complex aggregations slow down significantly (6.28ms → 966.01ms)
- **Individual record access**: Maintains good performance for picking individual records
- **Database size reporting issue**: Shows 0 total records after bulk insert (possible query syntax issue)

## LMDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 key-value pairs | 15.91ms | 8.09ms | +27MB → +10MB |
| | Pick key-value pairs | 3.98ms | 2.31ms | |
| | Batch get operation | 1.96ms | 1.84ms | |
| | Range scan (first 1000) | 3.07ms | 1.23ms | |
| | Key existence check | 0.23ms | 0.11ms | |
| **Phase 2** | Bulk insert (1M records) | - | 1.99s | +153MB |

### Key Observations:
- **Outstanding bulk insert performance**: 1.99 seconds for 1M records (≈502,500 records/sec) - 1.7x faster than SQLite, fastest overall
- **Excellent performance consistency**: Operations improve or remain stable with large datasets
- **Memory efficient**: Started at 56MB, ended at 219MB after 1M+ records (163MB total growth)
- **Memory-mapped efficiency**: Benefits from LMDB's memory-mapped architecture
- **Key-value optimization**: Exceptional performance for all key-value operations
- **Sub-millisecond operations**: Fastest existence checks and excellent batch operations
- **Stable performance**: No degradation with dataset size, consistent high performance
- **Compression benefits**: Uses compression for efficient storage

# Results on Windows

## Empty Database Performance Comparison

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **SQLite (Bun)** | 17.48ms | 7.51ms | 3.72ms | 1.36ms | 1.05ms |
| **PostgreSQL** | 122.97ms | 68.90ms | 6.14ms | 2.75ms | 4.30ms |
| **TimescaleDB** | 119.92ms | 86.48ms | 9.52ms | 4.35ms | 3.49ms |
| **SurrealDB** | 62.22ms | 189.01ms | 320.61ms | 10.53ms | 10.94ms |
| **LevelDB** | 48.38ms | 16.43ms | - | - | - |
| **LMDB** | 226.17ms | 9.98ms | - | - | - |
| **DuckDB** | 5.24s | 495.69ms | 41.99ms | 3.09ms | 1.13ms |

## Bulk Insert Performance Comparison

| Database | Time (1M records) | Records/sec | Ranking |
|----------|-------------------|-------------|---------|
| **SQLite (Bun)** | 10.32s | ~96,900 | 🥇 1st |
| **PostgreSQL** | 13.63s | ~73,400 | 🥈 2nd |
| **LevelDB** | 29.30s | ~34,100 | 🥉 3rd |
| **SurrealDB** | 30.44s | ~32,800 | 4th |
| **LMDB** | 48.66s | ~20,500 | 5th |
| **TimescaleDB** | 123.90s | ~8,100 | 6th |
| **DuckDB** | 348.42s | ~2,900 | 7th |

## Populated Database Performance Comparison (1M+ records)

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **LevelDB** | 20.07ms | 12.31ms | - | - | - |
| **SQLite (Bun)** | 187.52ms | 11.19ms | 4.81ms | 548.97ms | 255.91ms |
| **PostgreSQL** | 42.58ms | 37.49ms | 56.73ms | 341.91ms | 1362.76ms |
| **SurrealDB** | 80.12ms | 201.61ms | 173.03s | 50.95ms | 5.21s |
| **TimescaleDB** | 96.69ms | 17.91s | 800.08ms | 32.10ms | 6.57ms |
| **LMDB** | 42.14ms | 6.01ms | - | - | - |
| **DuckDB** | 5.47s | 589.57ms | 48.45ms | 28.79ms | 11.92ms |

## Memory Usage Comparison

| Database | Starting Memory | Final Memory | Total Growth | Growth per 1M Records |
|----------|----------------|--------------|--------------|---------------------|
| **SQLite (Bun)** | 315MB | 366MB | 51MB | ~51MB |
| **PostgreSQL** | 321MB | 440MB | 119MB | ~119MB |
| **TimescaleDB** | 309MB | 406MB | 97MB | ~97MB |
| **SurrealDB** | 293MB | 476MB | 183MB | ~183MB |
| **LevelDB** | 147MB | 357MB | 210MB | ~210MB |
| **LMDB** | 52MB | 1986MB | 1934MB | ~1934MB |
| **DuckDB** | 309MB | 392MB | 83MB | ~83MB |

### Key Insights:

**🏆 Performance Winners:**
- **Bulk Insert Champion**: SQLite (Bun) - 96.9k records/sec
- **Small Operations Leader**: SQLite (Bun) - consistently fastest for small-scale operations
- **Memory Efficiency**: SQLite (Bun) - only 51MB growth per 1M records
- **Key-Value Performance**: LevelDB - excellent performance for key-value operations
- **Analytical Queries**: TimescaleDB - specialized for time-series analytics

**⚠️ Notable Observations:**
- **SQLite (Bun)** dominates in both performance and memory efficiency - the overall best choice for most use cases
- **PostgreSQL** provides excellent balance of performance and SQL features with reasonable memory usage
- **TimescaleDB** shows specialized time-series optimization advantages but with slower bulk operations
- **SurrealDB** struggles with complex queries on large datasets
- **LevelDB** excels at key-value operations with consistent performance
- **LMDB** shows high memory usage but good key-value performance

# Results on WSL

## Empty Database Performance Comparison

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **SQLite (Bun)** | 18.43ms | 9.22ms | 4.10ms | 1.07ms | 0.90ms |
| **LMDB** | 43.57ms | 5.88ms | - | - | - |
| **PostgreSQL** | 48.88ms | 57.46ms | 7.24ms | 6.57ms | 3.96ms |
| **TimescaleDB** | 83.15ms | 78.58ms | 9.97ms | 7.61ms | 3.05ms |
| **DuckDB** | 10.63s | 657.14ms | 35.06ms | 2.72ms | 1.62ms |

## Bulk Insert Performance Comparison

| Database | Time (1M records) | Records/sec | Ranking |
|----------|-------------------|-------------|---------|
| **LMDB** | 7.21s | ~138,700 | 🥇 1st |
| **SQLite (Bun)** | 12.05s | ~83,000 | 🥈 2nd |
| **PostgreSQL** | 13.25s | ~75,500 | 🥉 3rd |
| **TimescaleDB** | 128.59s | ~7,800 | 4th |
| **DuckDB** | 489.82s | ~2,000 | 5th |

## Populated Database Performance Comparison (1M+ records)

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **LMDB** | 26.72ms | 5.76ms | - | - | - |
| **SQLite (Bun)** | 123.27ms | 11.72ms | 4.94ms | 485.28ms | 284.62ms |
| **PostgreSQL** | 46.00ms | 31.03ms | 19.07ms | 127.88ms | 1228.78ms |
| **TimescaleDB** | 56.30ms | 15.44s | 765.43ms | 26.58ms | 6.57ms |
| **DuckDB** | 10.99s | 719.80ms | 37.25ms | 32.40ms | 9.45ms |

## Memory Usage Comparison

| Database | Starting Memory | Final Memory | Total Growth | Growth per 1M Records |
|----------|----------------|--------------|--------------|---------------------|
| **SQLite (Bun)** | 142MB | 217MB | 75MB | ~75MB |
| **LMDB** | 65MB | 171MB | 106MB | ~106MB |
| **PostgreSQL** | 150MB | 193MB | 43MB | ~43MB |
| **TimescaleDB** | 133MB | 156MB | 23MB | ~23MB |
| **DuckDB** | 219MB | 494MB | 275MB | ~275MB |

### Key Insights:

**🏆 Performance Winners:**
- **Bulk Insert Champion**: LMDB - 138.7k records/sec
- **Small Operations Leader**: SQLite (Bun) - consistently fastest for small-scale operations
- **Memory Efficiency**: TimescaleDB - only 23MB growth per 1M records
- **Key-Value Performance**: LMDB - excellent performance for key-value operations
- **Analytical Queries**: TimescaleDB - specialized for time-series analytics

**⚠️ Notable Observations:**
- **LMDB** dominates bulk insert performance and key-value operations
- **SQLite (Bun)** provides excellent balance of performance and memory efficiency
- **PostgreSQL** shows good performance for most operations with reasonable memory usage
- **TimescaleDB** shows specialized time-series optimization with excellent memory efficiency
- **DuckDB** struggles with bulk operations but shows good analytical query performance
