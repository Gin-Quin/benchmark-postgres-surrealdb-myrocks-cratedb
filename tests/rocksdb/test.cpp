// clang++ test.cpp -o test -L /usr/local/lib -lrocksdb -std=c++20

#include "rocksdb/db.h"
#include <iostream>


void put(rocksdb::DB* db, const char* key, const char* value) {
	rocksdb::WriteOptions write_options;
	// write_options.sync = true;
	rocksdb::Status status = db->Put(write_options, key, value);

	if (!status.ok()) {
		// Handle error
	}
}

std::string get(rocksdb::DB* db, const char* key) {
	rocksdb::ReadOptions read_options;
	std::string value;
	rocksdb::Status status = db->Get(read_options, key, &value);

	if (status.ok()) {
		return value;
	} else {
		return nullptr;
	}
}

int main() {
	rocksdb::Options options;
	options.create_if_missing = true;
	rocksdb::DB* db;

	rocksdb::Status status = rocksdb::DB::Open(options, "rocks.db", &db);

	if (!status.ok()) {
		// Handle error
	}

	auto count = 40;

	// start timer
	auto start = std::chrono::high_resolution_clock::now();

	for (auto i = 0; i < count; i++) {
		put(db, "key", "value");
	}

	// print timer
	auto finish = std::chrono::high_resolution_clock::now();
	std::chrono::duration<double> elapsed = finish - start;
	std::cout << "Elapsed time: " << elapsed.count() << " s\n";

	delete db;

	return 0;
}

