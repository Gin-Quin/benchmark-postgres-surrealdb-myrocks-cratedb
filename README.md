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
    <th>30ms</th>
    <th>3ms</th>
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
</table>

## Conclusion

- If you need a huge amount of small writes, Postgres is not to be considered. Scylla is overperforming other databases, and Crate is quite good as well.
- If you need to read big amounts of data, Postgres is by far the best. All other databases are quite slow, and Scylla is the worst by far.
- If you need to read a lot of small elements by id rather than bulks of data, Scylla is a good option, outperforming Surreal.
- Postgres and Surreal are the most stable databases, as they never crashed. Scylla crashes when you get more than 2048 simultaneous requests, which is a shame because it's where it shines. Crate crashes when you have a lot of simultaneous reads (it's an error from the postgres driver though, but still proves some instability).
- Crate has an annoying drawback: when you make a write, the change is not immediately effective and you can't read it before about 1 second. It may cause some annoying bugs.
- Surreal has the best developer experience by far. The documentation is very clear, the installation super smooth, and the SDKs as well as the query language are great. It's 3 times better than Postgres for writing documents separately, but 3 to 6 times slower to read these documents. Might be a good alternative for write-intensive projects.
- Except for Postgres, the other databases are bad for migration. Migrating a database means transforming the structure of a table. If you opt for a NoSQL database, you should use "soft migrations" (migrating a document when the document is loaded) rather than "hard migration" (migrating all documents at once).