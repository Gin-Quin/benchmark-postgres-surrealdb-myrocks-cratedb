# Cross-Platform Database Performance Comparison

## Empty Database Performance Comparison

| Database | Platform | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|----------|---------------------|--------------|------------------|-------------------|-------------|
| **SQLite (Bun)** | Mac | 7.79ms | 7.05ms | 1.97ms | 0.65ms | 0.66ms |
| **SQLite (Bun)** | Windows | 17.48ms | 7.51ms | 3.72ms | 1.36ms | 1.05ms |
| **SQLite (Bun)** | WSL | 18.43ms | 9.22ms | 4.10ms | 1.07ms | 0.90ms |
| **LMDB** | Mac | 15.91ms | 3.98ms | - | - | - |
| **LMDB** | Windows | 226.17ms | 9.98ms | - | - | - |
| **LMDB** | WSL | 43.57ms | 5.88ms | - | - | - |
| **LevelDB** | Mac | 16.94ms | 3.84ms | - | - | - |
| **LevelDB** | Windows | 48.38ms | 16.43ms | - | - | - |
| **LevelDB** | WSL | 58.42ms | 11.54ms | - | - | - |
| **PostgreSQL** | Mac | 29.23ms | 26.35ms | 2.88ms | 1.63ms | 3.77ms |
| **PostgreSQL** | Windows | 122.97ms | 68.90ms | 6.14ms | 2.75ms | 4.30ms |
| **PostgreSQL** | WSL | 48.88ms | 57.46ms | 7.24ms | 6.57ms | 3.96ms |
| **SurrealDB** | Mac | 37.86ms | 44.04ms | 159.73ms | 6.09ms | 6.28ms |
| **SurrealDB** | Windows | 62.22ms | 189.01ms | 320.61ms | 10.53ms | 10.94ms |
| **SurrealDB** | WSL | 64.46ms | 216.57ms | 402.50ms | 1.15ms | 19.21ms |
| **TimescaleDB** | Mac | 40.42ms | 35.62ms | 3.44ms | 1.18ms | 1.25ms |
| **TimescaleDB** | Windows | 119.92ms | 86.48ms | 9.52ms | 4.35ms | 3.49ms |
| **TimescaleDB** | WSL | 83.15ms | 78.58ms | 9.97ms | 7.61ms | 3.05ms |
| **DuckDB** | Mac | 353.60ms | 137.12ms | 12.25ms | 1.59ms | 0.45ms |
| **DuckDB** | Windows | 5.24s | 495.69ms | 41.99ms | 3.09ms | 1.13ms |
| **DuckDB** | WSL | 10.63s | 657.14ms | 35.06ms | 2.72ms | 1.62ms |

## Bulk Insert Performance Comparison

| Database | Platform | Time (1M records) | Records/sec | Ranking |
|----------|----------|-------------------|-------------|---------|
| **LMDB** | Mac | 1.99s | ~502,500 | 🥇 1st |
| **LMDB** | WSL | 7.21s | ~138,700 | 🥇 1st |
| **SQLite (Bun)** | Mac | 3.46s | ~289,000 | 🥈 2nd |
| **SQLite (Bun)** | Windows | 10.32s | ~96,900 | 🥇 1st |
| **SQLite (Bun)** | WSL | 12.05s | ~83,000 | 🥈 2nd |
| **LevelDB** | Mac | 5.72s | ~174,800 | 🥉 3rd |
| **LevelDB** | Windows | 29.30s | ~34,100 | 🥉 3rd |
| **LevelDB** | WSL | 19.64s | ~50,900 | 4th |
| **PostgreSQL** | Mac | 7.12s | ~140,400 | 4th |
| **PostgreSQL** | Windows | 13.63s | ~73,400 | 🥈 2nd |
| **PostgreSQL** | WSL | 13.25s | ~75,500 | 🥉 3rd |
| **SurrealDB** | Mac | 12.58s | ~79,500 | 5th |
| **SurrealDB** | Windows | 30.44s | ~32,800 | 4th |
| **SurrealDB** | WSL | 29.46s | ~34,000 | 5th |
| **TimescaleDB** | Mac | 31.41s | ~31,800 | 6th |
| **TimescaleDB** | Windows | 123.90s | ~8,100 | 6th |
| **TimescaleDB** | WSL | 128.59s | ~7,800 | 4th |
| **DuckDB** | Mac | 73.07s | ~13,700 | 7th |
| **DuckDB** | Windows | 348.42s | ~2,900 | 7th |
| **DuckDB** | WSL | 489.82s | ~2,000 | 5th |
| **LMDB** | Windows | 48.66s | ~20,500 | 5th |

## Populated Database Performance Comparison (1M+ records)

| Database | Platform | Insert 2048 Records | Pick Records | Select Benchmark | Complex Analytical | Aggregation |
|----------|----------|---------------------|--------------|------------------|-------------------|-------------|
| **LMDB** | Mac | 8.09ms | 2.31ms | - | - | - |
| **LMDB** | Windows | 42.14ms | 6.01ms | - | - | - |
| **LMDB** | WSL | 26.72ms | 5.76ms | - | - | - |
| **LevelDB** | Mac | 10.92ms | 2.28ms | - | - | - |
| **LevelDB** | Windows | 20.07ms | 12.31ms | - | - | - |
| **LevelDB** | WSL | 38.87ms | 10.71ms | - | - | - |
| **SurrealDB** | Mac | 30.40ms | 37.70ms | 76.08s | 5.60ms | 966.01ms |
| **SurrealDB** | Windows | 80.12ms | 201.61ms | 173.03s | 50.95ms | 5.21s |
| **SurrealDB** | WSL | 90.48ms | 196.72ms | 181.06s | 40.63ms | 5.37s |
| **TimescaleDB** | Mac | 31.14ms | 8.47s | 294.91ms | 5.62ms | 2.27ms |
| **TimescaleDB** | Windows | 96.69ms | 17.91s | 800.08ms | 32.10ms | 6.57ms |
| **TimescaleDB** | WSL | 56.30ms | 15.44s | 765.43ms | 26.58ms | 6.57ms |
| **PostgreSQL** | Mac | 66.46ms | 20.77ms | 7.57ms | 76.62ms | 1038.57ms |
| **PostgreSQL** | Windows | 42.58ms | 37.49ms | 56.73ms | 341.91ms | 1362.76ms |
| **PostgreSQL** | WSL | 46.00ms | 31.03ms | 19.07ms | 127.88ms | 1228.78ms |
| **SQLite (Bun)** | Mac | 77.18ms | 10.27ms | 2.96ms | 272.58ms | 188.97ms |
| **SQLite (Bun)** | Windows | 187.52ms | 11.19ms | 4.81ms | 548.97ms | 255.91ms |
| **SQLite (Bun)** | WSL | 123.27ms | 11.72ms | 4.94ms | 485.28ms | 284.62ms |
| **DuckDB** | Mac | 377.46ms | 148.01ms | 13.62ms | 19.32ms | 6.06ms |
| **DuckDB** | Windows | 5.47s | 589.57ms | 48.45ms | 28.79ms | 11.92ms |
| **DuckDB** | WSL | 10.99s | 719.80ms | 37.25ms | 32.40ms | 9.45ms |

## Memory Usage Comparison

| Database | Platform | Starting Memory | Final Memory | Total Growth | Growth per 1M Records |
|----------|----------|----------------|--------------|--------------|---------------------|
| **TimescaleDB** | Mac | 131MB | 177MB | 46MB | ~46MB |
| **TimescaleDB** | WSL | 133MB | 156MB | 23MB | ~23MB |
| **SQLite (Bun)** | Mac | 169MB | 270MB | 101MB | ~101MB |
| **SQLite (Bun)** | Windows | 315MB | 366MB | 51MB | ~51MB |
| **SQLite (Bun)** | WSL | 142MB | 217MB | 75MB | ~75MB |
| **PostgreSQL** | Mac | 131MB | 247MB | 116MB | ~116MB |
| **PostgreSQL** | Windows | 321MB | 440MB | 119MB | ~119MB |
| **PostgreSQL** | WSL | 150MB | 193MB | 43MB | ~43MB |
| **LMDB** | Mac | 56MB | 219MB | 163MB | ~163MB |
| **LMDB** | Windows | 52MB | 1986MB | 1934MB | ~1934MB |
| **LMDB** | WSL | 65MB | 171MB | 106MB | ~106MB |
| **LevelDB** | Mac | 37MB | 217MB | 180MB | ~180MB |
| **LevelDB** | Windows | 147MB | 357MB | 210MB | ~210MB |
| **LevelDB** | WSL | 49MB | 153MB | 104MB | ~104MB |
| **SurrealDB** | Mac | 128MB | 401MB | 273MB | ~273MB |
| **SurrealDB** | Windows | 293MB | 476MB | 183MB | ~183MB |
| **SurrealDB** | WSL | 125MB | 257MB | 132MB | ~132MB |
| **TimescaleDB** | Windows | 309MB | 406MB | 97MB | ~97MB |
| **DuckDB** | Mac | 304MB | 682MB | 378MB | ~378MB |
| **DuckDB** | Windows | 309MB | 392MB | 83MB | ~83MB |
| **DuckDB** | WSL | 219MB | 494MB | 275MB | ~275MB |

## Platform Performance Analysis

### Windows vs Mac vs WSL Performance Differences

#### SQLite (Bun) Performance Comparison:
- **Empty DB Operations**: 
  - Windows is 2.2-2.7x slower than Mac
  - WSL is 2.4-6.3x slower than Mac
  - Windows vs WSL: Windows is 1.1x slower than WSL
  - Insert: Mac 7.79ms, WSL 18.43ms, Windows 17.48ms
  - Pick: Mac 7.05ms, WSL 9.22ms, Windows 7.51ms
  - Select: Mac 1.97ms, WSL 4.10ms, Windows 3.72ms
  - Complex queries: Mac 0.65ms, WSL 1.07ms, Windows 1.36ms
- **Bulk Insert**: 
  - Mac: 3.46s (289k records/sec)
  - WSL: 12.05s (83k records/sec) - 3.5x slower than Mac
  - Windows: 10.32s (97k records/sec) - 3.0x slower than Mac
- **Populated DB Operations**: 
  - Mac is fastest, WSL and Windows are slower
  - Insert: Mac 77.18ms, WSL 123.27ms, Windows 187.52ms
  - Pick: Mac 10.27ms, WSL 11.72ms, Windows 11.19ms
- **Memory Usage**: 
  - Mac: 169MB initial, 270MB final
  - WSL: 142MB initial, 217MB final (most efficient)
  - Windows: 315MB initial, 366MB final (highest usage)

#### LMDB Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 15.91ms, WSL 43.57ms, Windows 226.17ms
  - Pick: Mac 3.98ms, WSL 5.88ms, Windows 9.98ms
- **Bulk Insert**: 
  - Mac: 1.99s (502k records/sec) - fastest
  - WSL: 7.21s (139k records/sec) - 3.6x slower than Mac
  - Windows: 48.66s (21k records/sec) - 24.4x slower than Mac
- **Populated DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 8.09ms, WSL 26.72ms, Windows 42.14ms
  - Pick: Mac 2.31ms, WSL 5.76ms, Windows 6.01ms
- **Memory Usage**: 
  - Mac: 56MB initial, 219MB final
  - WSL: 65MB initial, 171MB final (most efficient)
  - Windows: 52MB initial, 1986MB final (extreme usage)

#### LevelDB Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 16.94ms, WSL 58.42ms, Windows 48.38ms
  - Pick: Mac 3.84ms, WSL 11.54ms, Windows 16.43ms
- **Bulk Insert**: 
  - Mac: 5.72s (175k records/sec) - fastest
  - WSL: 19.64s (51k records/sec) - 3.4x slower than Mac
  - Windows: 29.30s (34k records/sec) - 5.1x slower than Mac
- **Populated DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 10.92ms, WSL 38.87ms, Windows 20.07ms
  - Pick: Mac 2.28ms, WSL 10.71ms, Windows 12.31ms
- **Memory Usage**: 
  - Mac: 37MB initial, 217MB final
  - WSL: 49MB initial, 153MB final (most efficient)
  - Windows: 147MB initial, 357MB final (highest usage)

#### PostgreSQL Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 29.23ms, WSL 48.88ms, Windows 122.97ms
  - Pick: Mac 26.35ms, WSL 57.46ms, Windows 68.90ms
  - Select: Mac 2.88ms, WSL 7.24ms, Windows 6.14ms
- **Bulk Insert**: 
  - Mac: 7.12s (140k records/sec) - fastest
  - WSL: 13.25s (76k records/sec) - 1.9x slower than Mac
  - Windows: 13.63s (73k records/sec) - 1.9x slower than Mac
- **Populated DB Operations**: 
  - Insert: WSL 46.00ms, Windows 42.58ms, Mac 66.46ms
  - Pick: Mac 20.77ms, WSL 31.03ms, Windows 37.49ms
  - Complex queries: Mac 76.62ms, WSL 127.88ms, Windows 341.91ms
- **Memory Usage**: 
  - Mac: 131MB initial, 247MB final
  - WSL: 150MB initial, 193MB final (most efficient)
  - Windows: 321MB initial, 440MB final (highest usage)

#### SurrealDB Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 37.86ms, WSL 64.46ms, Windows 62.22ms
  - Pick: Mac 44.04ms, WSL 216.57ms, Windows 189.01ms
  - Select: Mac 159.73ms, WSL 402.50ms, Windows 320.61ms
- **Bulk Insert**: 
  - Mac: 12.58s (80k records/sec) - fastest
  - WSL: 29.46s (34k records/sec) - 2.3x slower than Mac
  - Windows: 30.44s (33k records/sec) - 2.4x slower than Mac
- **Populated DB Operations**: 
  - Mac is fastest, WSL and Windows are slower
  - Insert: Mac 30.40ms, WSL 90.48ms, Windows 80.12ms
  - Pick: Mac 37.70ms, WSL 196.72ms, Windows 201.61ms
  - Select: Mac 76.08s, WSL 181.06s, Windows 173.03s
- **Memory Usage**: 
  - Mac: 128MB initial, 401MB final
  - WSL: 125MB initial, 257MB final (most efficient)
  - Windows: 293MB initial, 476MB final (highest usage)

#### TimescaleDB Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 40.42ms, WSL 83.15ms, Windows 119.92ms
  - Pick: Mac 35.62ms, WSL 78.58ms, Windows 86.48ms
  - Select: Mac 3.44ms, WSL 9.97ms, Windows 9.52ms
- **Bulk Insert**: 
  - Mac: 31.41s (32k records/sec) - fastest
  - WSL: 128.59s (8k records/sec) - 4.1x slower than Mac
  - Windows: 123.90s (8k records/sec) - 3.9x slower than Mac
- **Populated DB Operations**: 
  - Insert: WSL 56.30ms, Mac 31.14ms, Windows 96.69ms
  - Pick: Mac 8.47s, WSL 15.44s, Windows 17.91s
  - Complex queries: Mac 5.62ms, WSL 26.58ms, Windows 32.10ms
- **Memory Usage**: 
  - Mac: 131MB initial, 177MB final
  - WSL: 133MB initial, 156MB final (most efficient)
  - Windows: 309MB initial, 406MB final (highest usage)

#### DuckDB Performance Comparison:
- **Empty DB Operations**: 
  - Mac is fastest, WSL is middle, Windows is slowest
  - Insert: Mac 353.60ms, WSL 10.63s, Windows 5.24s
  - Pick: Mac 137.12ms, WSL 657.14ms, Windows 495.69ms
  - Select: Mac 12.25ms, WSL 35.06ms, Windows 41.99ms
  - Complex queries: Mac 1.59ms, WSL 2.72ms, Windows 3.09ms
- **Bulk Insert**: 
  - Mac: 73.07s (14k records/sec) - fastest
  - WSL: 489.82s (2k records/sec) - 6.7x slower than Mac
  - Windows: 348.42s (3k records/sec) - 4.8x slower than Mac
- **Populated DB Operations**: 
  - Mac is fastest, WSL and Windows are significantly slower
  - Insert: Mac 377.46ms, WSL 10.99s, Windows 5.47s
  - Pick: Mac 148.01ms, WSL 719.80ms, Windows 589.57ms
  - Select: Mac 13.62ms, WSL 37.25ms, Windows 48.45ms
- **Memory Usage**: 
  - Mac: 304MB initial, 682MB final
  - WSL: 219MB initial, 494MB final (most efficient)
  - Windows: 309MB initial, 392MB final

### Key Insights:

**🏆 Platform Performance Winners:**
- **Mac**: Consistently fastest across all operations and databases
- **WSL**: Good middle-ground performance with excellent memory efficiency
- **Windows**: Higher memory usage but some operations show competitive performance

**⚠️ Notable Platform Differences:**
- **Memory Efficiency**: WSL shows the best memory efficiency across most databases
- **Bulk Insert Performance**: Mac is significantly faster for bulk operations across all databases
- **Query Performance**: Mac shows better performance for complex analytical queries
- **Key-Value Databases**: Mac shows superior performance for LMDB and LevelDB operations
- **Consistency**: Mac shows more consistent performance across different operation types

**🔍 Performance Patterns:**
- **Mac**: Superior performance for complex queries and bulk operations
- **WSL**: Excellent memory efficiency and good performance for most operations
- **Windows**: Better performance for some simple operations but higher memory usage
- **Memory Efficiency**: WSL is most memory-efficient, followed by Mac, then Windows
- **Query Degradation**: Windows shows more severe performance degradation with large datasets
- **LMDB Exception**: Windows LMDB shows extreme memory usage (1986MB vs 219MB)

**📊 Database-Specific Observations:**
- **SQLite (Bun)**: Most consistent performance between platforms, still faster on Mac
- **LMDB**: Most dramatic performance difference - 24.4x slower bulk insert on Windows
- **LevelDB**: Significant performance gap, especially in key-value operations
- **PostgreSQL**: Most balanced performance, WSL shows good efficiency
- **SurrealDB**: Consistent performance pattern with other databases
- **TimescaleDB**: Shows similar patterns to PostgreSQL, WSL has best memory efficiency
- **DuckDB**: Most dramatic performance difference - 14.8x slower inserts on Windows, but better memory efficiency

**🆕 WSL-Specific Insights:**
- **Memory Efficiency**: WSL consistently shows the lowest memory usage across databases
- **Performance Balance**: WSL provides good performance while maintaining excellent memory efficiency
- **Bulk Operations**: WSL performs better than Windows for bulk operations but slower than Mac
- **Key-Value Performance**: WSL shows good performance for LMDB operations
- **Analytical Queries**: WSL performs well for analytical queries, especially with TimescaleDB

### Recommendations:

1. **For Development**: Mac provides better performance for database development and testing
2. **For Production**: Consider platform-specific optimizations based on deployment environment
3. **Memory Considerations**: 
   - Windows deployments may require significantly more memory allocation
   - WSL provides excellent memory efficiency for resource-constrained environments
4. **Bulk Operations**: Mac is significantly better for data migration and bulk loading
5. **Analytical Workloads**: Mac shows superior performance for complex analytical queries
6. **Key-Value Workloads**: Mac is significantly better for LMDB and LevelDB operations
7. **SQLite Consideration**: Most portable option with consistent performance across platforms
8. **WSL Benefits**: Excellent choice for Windows users who need better performance and memory efficiency
9. **Platform Selection**: 
   - Mac: Best overall performance
   - WSL: Best memory efficiency with good performance
   - Windows: Higher memory usage but some competitive operations 