This is a simple benchmark to test performance of various databases: Scylla, Crate, Surreal and Postgres.

All these databases are NoSQL except Postgres, which explain some of results of the benchmark. But it is worth to compare as they all the same role to write and read data.

This is not an extensive benchmark, relations have not been tested. Only writes (small simultaneous writes) and reads.

> For bulk writing (adding a lot of documents in one query), Postgres outperforms all other databases.

<table>
  <tr>
    <th>Database</th>
    <th>Simultaneous writes</th>
    <th>Simultaneous reads</th>
    <th>Bulk reading</th>
  </tr>
  <tr>
    <th>Postgres</th>
    <th>865ms</th>
    <th>60ms</th>
    <th>6ms</th>
  </tr>
  <tr>
    <th>SQLite (bun)</th>
    <th>290ms</th>
    <th>100ms</th>
    <th>0.03ms</th>
  </tr>
  <tr>
    <th>SQLite (node + better-sqlite-3)</th>
    <th>171ms</th>
    <th>27ms</th>
    <th>0.361ms</th>
  </tr>
  <tr>
    <th>Surreal</th>
    <th>258ms</th>
    <th>162ms</th>
    <th>10ms</th>
  </tr>
  <tr>
    <th>Scylla</th>
    <th>75ms</th>
    <th>42ms</th>
    <th>21ms</th>
  </tr>
  <tr>
    <th>Crate</th>
    <th>125ms</th>
    <th>CRASH</th>
    <th>5ms</th>
  </tr>
  <tr>
    <th>LevelDB (bun)</th>
    <th>60ms</th>
    <th>15ms</th>
    <th>35ms</th>
  </tr>
  <tr>
    <th>LevelDB (node)</th>
    <th>60ms</th>
    <th>32ms</th>
    <th>50ms</th>
  </tr>
  <tr>
    <th>RocksDB (bun)</th>
    <th>44ms</th>
    <th>11ms</th>
    <th>?</th>
  </tr>
</table>

## Conclusion

- If you need a huge amount of small writes, Postgres is not to be considered. If you don't need to perform database scanning, LevelDB and RocksDB are the best choices. Otherwise, Scylla is overperforming other databases, and Crate is quite good as well.
- If you need to read big amounts of data, Postgres is by far the best. All other databases are quite slow, and Scylla is the worst by far.
- If you need to read a lot of small elements by id rather than bulks of data, Scylla is a good option, outperforming Surreal.
- Postgres, Surreal, LevelDB and RocksDB are the most stable databases, as they never crashed. Scylla crashes when you get more than 2048 simultaneous requests, which is a shame because it's where it shines. Crate crashes when you have a lot of simultaneous reads (it's an error from the postgres driver though, but still proves some instability).
- Crate has an annoying drawback: when you make a write, the change is not immediately effective and you can't read it before about 1 second. It may cause some annoying bugs.
- When comparing LevelDB and RocksDB with Bun FFI, both databases offer similar performances, excellent both for writing and picking values from a given id. If you need the most writing-intensive architecture, RocksDB can handle more writing (up to 2x faster for very big loads). LevelDB is easier to integrate into a Javascript server thanks to a nice library. But both are incredible databases.
- Bun is faster than Node to run LevelDB, especially for reading.
- Node with better-sqlite-3 seems faster than Bun's SQLite for writing and picking specific values to database, but Bun's SQLite is extremely fast to scan the database.
- Surreal offers an awesome developer experience. The documentation is very clear, the installation super smooth, and the SDKs as well as the query language are great. It's 3 times better than Postgres for writing documents separately, but 3 to 6 times slower to read these documents. Might be a good alternative for write-intensive projects.
- Except for Postgres, the other databases are bad for migration. Migrating a database means transforming the structure of a table. If you opt for a NoSQL database, you should use "soft migrations" (migrating a document when the document is loaded) rather than "hard migration" (migrating all documents at once).
