/**
 * COMPIATION INSTRUCTIONS
 * 
 * MacOS
 * 1. Install RocksDB: brew install rocksdb
 * 2. Compile the library: clang -shared -fPIC librocks.c -o librocksdb_c.so -I /opt/homebrew/include -L /opt/homebrew/lib -lrocksdb -O3
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <assert.h>

#include "rocksdb/c.h"

#if defined(OS_WIN)
	#include <Windows.h>
#else
	#include <unistd.h>  // sysconf() - get CPU count
#endif

struct RocksDBContext {
	rocksdb_t* db;
	rocksdb_backup_engine_t* be;
	rocksdb_options_t *options;
	rocksdb_writeoptions_t *writeoptions;
	rocksdb_readoptions_t *readoptions;
};

struct RocksDBContext* initialize_database(const char* db_path) {
	struct RocksDBContext* context = malloc(sizeof(struct RocksDBContext));
	context->db = NULL;
	context->be = NULL;
	context->options = rocksdb_options_create();
	context->writeoptions = rocksdb_writeoptions_create();
	context->readoptions = rocksdb_readoptions_create();

	#if defined(OS_WIN)
		SYSTEM_INFO system_info;
		GetSystemInfo(&system_info);
		long cpus = system_info.dwNumberOfProcessors;
	#else
		long cpus = sysconf(_SC_NPROCESSORS_ONLN);
	#endif

	// rocksdb_options_increase_parallelism(context->options, (int)cpus);
	rocksdb_options_set_create_if_missing(context->options, 1);
	rocksdb_options_set_compression(context->options, rocksdb_snappy_compression);

	char* err = NULL;
	context->db = rocksdb_open(context->options, db_path, &err);
	assert(!err);

	// open Backup Engine
	// be = rocksdb_backup_engine_open(options, db_path, &err);
	// assert(!err);

	return context;
}

void close_database(struct RocksDBContext* context) {
	rocksdb_close(context->db);
	rocksdb_options_destroy(context->options);
	rocksdb_writeoptions_destroy(context->writeoptions);
	rocksdb_readoptions_destroy(context->readoptions);
	free(context);
}

void put(struct RocksDBContext* context, char* key, unsigned int keyLength, char* value, unsigned int valueLength) {
    if (context == NULL || context->db == NULL || key == NULL || value == NULL) {
        // Handle the error or return early
        return;
    }
	rocksdb_put(context->db, context->writeoptions, key, keyLength, value, valueLength, NULL);
}

char* get(struct RocksDBContext* context, char* key, unsigned int keyLength, unsigned int* valueLength) {
	size_t length;
	char* value = rocksdb_get(context->db, context->readoptions, key, keyLength, &length, NULL);
	*valueLength = length;
	return value;
}

void delete(struct RocksDBContext* context, char* key, unsigned int keyLength) {
	rocksdb_delete(context->db, context->writeoptions, key, keyLength, NULL);
}

// void free_memory(char* value) {
// 	free(value);
// }
