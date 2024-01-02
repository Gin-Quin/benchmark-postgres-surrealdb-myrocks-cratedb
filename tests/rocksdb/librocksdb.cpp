// clang++ -shared -fPIC librocksdb.cpp -o librocksdb_example.so -L /usr/local/lib -lrocksdb -std=c++20

#include <iostream>
#include "rocksdb/db.h"
#include "rocksdb/c.h"


class BunString {
	public:
	std::string* string_ptr;
	char* c_str;

	// c++ delete function that free string_ptr
	~BunString() {
		delete string_ptr;
	}
};

extern "C" {
	const char* hello_world() {
		return "Hello World!";
	}

	// Initialize the RocksDB database
	rocksdb::DB* initialize_database(const char* db_path) {
		rocksdb::Options options;
		options.create_if_missing = true;
		rocksdb::DB* db;
		rocksdb_put;

		rocksdb::Status status = rocksdb::DB::Open(options, db_path, &db);

		if (!status.ok()) {
			// Handle error
		}

		return db;
	}

	// Put a key-value pair into the database
	void put(rocksdb::DB* db, const char* key, const char* value) {
		rocksdb::WriteOptions write_options;
		// write_options.sync = true;
		rocksdb::Status status = db->Put(write_options, key, value);

		if (!status.ok()) {
			// Handle error
		}
	}

	/**
	* Get the value for a given key from the database
	* @param db 
	* @param key 
	* @param then callback function to call with the c_str of the value
	* @return void
	*/
	BunString* get(rocksdb::DB* db, const char* key) {
		auto bun_string = new BunString();
		rocksdb::ReadOptions read_options;
		rocksdb::Status status = db->Get(read_options, key, bun_string->string_ptr);

		if (status.ok()) {
			return bun_string;
			//   char* result = static_cast<char*>(malloc(value.size() + 1));
			//   if (result != nullptr) {
			//       std::strcpy(result, value.c_str());
			//       return result;
			//   } else {
			//       // Handle memory allocation failure
			//       return nullptr;
			//   }
		} else {
			return nullptr;
			// Handle error
		}
	}

	void free_bun_string(BunString* bun_string) {
		delete bun_string;
	}

	// Free memory allocated by get function
	void free_memory(const char* ptr) {
		free(const_cast<char*>(ptr));
	}

	// Close the RocksDB database
	void close_database(rocksdb::DB* db) {
		delete db;
	}

}
