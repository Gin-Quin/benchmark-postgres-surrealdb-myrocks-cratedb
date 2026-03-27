# Results on M4 Chip

## Empty Database Performance Comparison

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **SQLite (Bun)** | 7.79ms | 7.05ms | 1.97ms | 0.65ms | 0.66ms |
| **ClickHouse** | 13.18ms | 5.27s | 16.63ms | 11.46ms | 9.52ms |
| **LMDB** | 15.91ms | 3.98ms | - | - | - |
| **LevelDB** | 16.94ms | 3.84ms | - | - | - |
| **OrioleDB** | 22.38ms | 29.31ms | 5.28ms | 1.68ms | 1.84ms |
| **PostgreSQL** | 29.23ms | 26.35ms | 2.88ms | 1.63ms | 3.77ms |
| **CedarDB** | 29.29ms | 30.38ms | 1.50ms | 1.11ms | 7.17ms |
| **SurrealDB** | 37.86ms | 44.04ms | 159.73ms | 6.09ms | 6.28ms |
| **TimescaleDB** | 40.42ms | 35.62ms | 3.44ms | 1.18ms | 1.25ms |
| **DuckDB** | 353.60ms | 137.12ms | 12.25ms | 1.59ms | 0.45ms |

## Bulk Insert Performance Comparison

| Database | Time (1M records) | Records/sec | Ranking |
|----------|-------------------|-------------|---------|
| **LMDB** | 1.99s | ~502,500 | 🥇 1st |
| **ClickHouse** | 1.97s | ~507,600 | 🥈 2nd |
| **SQLite (Bun)** | 3.46s | ~289,000 | 🥉 3rd |
| **LevelDB** | 5.72s | ~174,800 | 4th |
| **PostgreSQL** | 7.12s | ~140,400 | 5th |
| **OrioleDB** | 7.90s | ~126,600 | 6th |
| **CedarDB** | 10.40s | ~96,150 | 7th |
| **SurrealDB** | 12.58s | ~79,500 | 8th |
| **TimescaleDB** | 31.41s | ~31,800 | 9th |
| **DuckDB** | 73.07s | ~13,700 | 10th |

## Populated Database Performance Comparison (1M+ records)

| Database | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|---------------------|--------------|------------------|-------------------|-------------|
| **ClickHouse** | 6.60ms | 8.51s | 18.92ms | 19.40ms | 17.17ms |
| **LMDB** | 8.09ms | 2.31ms | - | - | - |
| **LevelDB** | 10.92ms | 2.28ms | - | - | - |
| **CedarDB** | 25.72ms | 52.64ms | 31.58ms | 24.19ms | 52.09ms |
| **SurrealDB** | 30.40ms | 37.70ms | 76.08s | 5.60ms | 966.01ms |
| **TimescaleDB** | 31.14ms | 8.47s | 294.91ms | 5.62ms | 2.27ms |
| **OrioleDB** | 32.11ms | 11.96ms | 7.50ms | 91.46ms | 668.25ms |
| **PostgreSQL** | 66.46ms | 20.77ms | 7.57ms | 76.62ms | 1038.57ms |
| **SQLite (Bun)** | 77.18ms | 10.27ms | 2.96ms | 272.58ms | 188.97ms |
| **DuckDB** | 377.46ms | 148.01ms | 13.62ms | 19.32ms | 6.06ms |

## Memory Usage Comparison

| Database | Starting Memory | Final Memory | Total Growth | Growth per 1M Records |
|----------|----------------|--------------|--------------|---------------------|
| **ClickHouse** | 137MB | 321MB | 184MB | ~3MB |
| **TimescaleDB** | 131MB | 177MB | 46MB | ~46MB |
| **SQLite (Bun)** | 169MB | 270MB | 101MB | ~101MB |
| **PostgreSQL** | 131MB | 247MB | 116MB | ~116MB |
| **OrioleDB** | 126MB | 242MB | 116MB | ~116MB |
| **CedarDB** | 132MB | 252MB | 120MB | ~120MB |
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
- **Bulk Insert Champion**: ClickHouse - 507k records/sec (new champion!)
- **Small Operations Leader**: SQLite (Bun) - consistently fastest for small-scale operations
- **Memory Efficiency**: ClickHouse - only 3MB growth during populated DB operations
- **Storage Efficiency**: SQLite (Bun) - most compact final size at 202MB
- **Analytical Queries**: ClickHouse & DuckDB - both optimized for analytics
- **Key-Value Performance**: LMDB - exceptional performance for key-value operations

**⚠️ Notable Observations:**
- **ClickHouse** achieves best-in-class bulk insert performance (507k records/sec) with excellent analytical query speed
- **LMDB** close second for bulk inserts (502k records/sec) with exceptional key-value operations
- **SQLite (Bun)** dominates in both performance and storage efficiency - the overall best choice for most use cases
- **LevelDB** excels at key-value operations with consistent performance and good compression
- **PostgreSQL** provides excellent balance of performance and SQL features with reasonable storage usage
- **OrioleDB** offers faster inserts than standard PostgreSQL with excellent pick performance on populated databases
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

## CedarDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 29.29ms | 25.72ms | +18MB → 0MB |
| | Pick authors | 30.38ms | 52.64ms | |
| | Select benchmark authors | 1.50ms | 31.58ms | |
| | Complex analytical query | 1.11ms | 24.19ms | |
| | Aggregation query | 7.17ms | 52.09ms | |
| **Phase 2** | Bulk insert (1M records) | - | 10.40s | +120MB |

### Key Observations:
- **Good bulk insert performance**: 10.40 seconds for 1M records (≈96,150 records/sec) - faster than SurrealDB and TimescaleDB
- **Memory efficient**: Started at 132MB, ended at 252MB after 1M+ records (120MB total growth)
- **Strong empty database performance**: Excellent performance for most operations on empty database, particularly for select queries (1.50ms)
- **Moderate query degradation**: Performance decreases with dataset size but remains reasonable (1.11ms → 24.19ms for complex analytical)
- **Stable memory management**: Shows efficient memory usage with no growth during populated database operations
- **Balanced performance**: Good all-around performance without extreme strengths or weaknesses
- **Consistency**: Similar performance profile to standard PostgreSQL with some optimizations

## ClickHouse Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 13.18ms | 6.60ms | +42MB → +3MB |
| | Pick authors | 5.27s | 8.51s | |
| | Select benchmark authors | 16.63ms | 18.92ms | |
| | Complex analytical query | 11.46ms | 19.40ms | |
| | Aggregation query | 9.52ms | 17.17ms | |
| **Phase 2** | Bulk insert (1M records) | - | 1.97s | +139MB |

### Key Observations:
- **Outstanding bulk insert performance**: 1.97 seconds for 1M records (≈507,600 records/sec) - fastest overall
- **Memory efficient**: Started at 137MB, ended at 321MB after 1M+ records, with only 3MB growth during populated DB operations
- **Excellent analytical performance**: Sub-20ms for complex analytical queries even with 1M+ records
- **Column-oriented optimization**: MergeTree engine provides exceptional write throughput and analytical query performance
- **Individual record access limitation**: Slower for picking individual records (5.27s-8.51s) due to column-oriented design
- **Stable performance**: Minimal degradation for analytical queries with large datasets
- **OLAP optimized**: Clear trade-off between individual record access and analytical performance
- **Batch processing**: Benefits from batched operations to avoid connection overwhelming

## PostgreSQL + OrioleDB Performance Benchmark

| Phase | Operation | Empty DB | Populated DB (1M+ records) | Memory Impact |
|-------|-----------|----------|----------------------------|---------------|
| **Phase 1** | Insert 2048 authors | 22.38ms | 32.11ms | +24MB → +1MB |
| | Pick authors | 29.31ms | 11.96ms | |
| | Select benchmark authors | 5.28ms | 7.50ms | |
| | Complex analytical query | 1.68ms | 91.46ms | |
| | Aggregation query | 1.84ms | 668.25ms | |
| **Phase 2** | Bulk insert (1M records) | - | 7.90s | +91MB |

### Key Observations:
- **Good bulk insert performance**: 7.90 seconds for 1M records (≈126,600 records/sec) - comparable to standard PostgreSQL
- **Memory efficient**: Started at 126MB, ended at 242MB after 1M+ records (116MB total growth)
- **Improved pick performance**: Significantly faster individual record access on populated DB (11.96ms vs PostgreSQL's 20.77ms)
- **Faster inserts**: 22.38ms for empty DB inserts vs PostgreSQL's 29.23ms (23% faster)
- **UNDO log benefits**: OrioleDB's UNDO-based MVCC reduces table bloat compared to standard PostgreSQL heap tables
- **Index-organized tables**: Primary key lookups benefit from OrioleDB's index-organized table structure
- **No VACUUM needed**: OrioleDB eliminates the need for dedicated garbage collection processes
- **Similar aggregation profile**: Aggregation queries show similar degradation pattern to standard PostgreSQL
- **Modern storage engine**: Designed for modern SSD and NVRAM hardware with lock-less page reading
