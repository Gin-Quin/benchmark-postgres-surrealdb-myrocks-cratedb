import {
	CString,
	dlopen,
	FFIType,
	JSCallback,
	Pointer,
	ptr,
	toArrayBuffer,
} from "bun:ffi"
import process from "node:process"

const path = `tests/rocksdb/librocksdb_example.so`
// const path = `librocksdb_example.so`

const {
	symbols: {
		initialize_database, // the function to call
		put,
		get,
		close_database,
		free_memory,
		free_bun_string,
		hello_world,
	},
} = dlopen(
	path, // a library name or file path
	{
		initialize_database: {
			// no arguments, returns a string
			args: [FFIType.cstring],
			returns: FFIType.ptr,
		},
		put: {
			args: [FFIType.ptr, FFIType.cstring, FFIType.cstring],
			returns: FFIType.void,
		},
		get: {
			args: [FFIType.ptr, FFIType.cstring],
			returns: FFIType.ptr,
		},
		free_memory: {
			args: [FFIType.ptr],
			returns: FFIType.void,
		},
		free_bun_string: {
			args: [FFIType.ptr],
			returns: FFIType.void,
		},
		close_database: {
			args: [FFIType.ptr],
			returns: FFIType.void,
		},
		hello_world: {
			args: [],
			returns: FFIType.cstring,
		},
	}
)

export class RocksDB {
	private db: Pointer | null

	constructor(path: string) {
		const db = initialize_database(ptr(Buffer.from(path)))
		if (!db) {
			throw new Error("Failed to initialize database")
		}
		this.db = db
		process.on("exit", () => this.close())
	}

	put(key: string, value: Buffer) {
		const response = put(this.db, Buffer.from(key), value)
	}

	get(key: string) {
		const result = get(this.db, ptr(Buffer.from(key)))
		if (result) {
			console.log("result:", result, toArrayBuffer(result, 0, 32))
			// free_bun_string(result)
		} else {
			console.log("result:", result)
		}
		return result
	}

	close() {
		if (!this.db) return
		close_database(this.db)
		this.db = null
	}
}

console.log("Hello world:", hello_world())

const db = new RocksDB("bun-rocks.db")

const key = "hello"
const value = Buffer.from("World")

console.log(`Putting key ${key} with value ${value}`)
db.put("hello", value)

console.log(`Getting key ${key}`)
const value2 = db.get(key)

console.log("Value:", value2)

db.close()

// console.log(`Loading rocksdb from ${path}`)

// const key = Buffer.from(Uint8Array.of(0, 1, 2, 3, 4))
// const value = Buffer.from("Yeppà")

// console.log("Initializing database")
// const db = initialize_database(ptr(Buffer.from("bun-rocks.db")))

// console.log("Putting key", value)
// put(db, key, ptr(value))

// console.log("Getting key")
// const value2 = get(db, key)

// console.log("Value:", value2)

// free_memory(value2.ptr)

// console.log("Closing database")
// close_database(db)
