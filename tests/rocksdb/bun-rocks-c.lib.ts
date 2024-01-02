import { dlopen, FFIType, Pointer, ptr, toArrayBuffer } from "bun:ffi"
import process from "node:process"

// path might change depending on your OS (not always a .so file)
const path = `tests/rocksdb/librocksdb_c.so`
// const path = `librocksdb_c.so`

const {
	symbols: {
		initialize_database, // the function to call
		close_database,
		put,
		get,
		remove,
	},
} = dlopen(
	path, // a library name or file path
	{
		initialize_database: {
			// no arguments, returns a string
			args: [FFIType.cstring],
			returns: FFIType.ptr,
		},
		close_database: {
			args: [FFIType.ptr],
			returns: FFIType.void,
		},
		put: {
			args: [FFIType.ptr, FFIType.ptr, FFIType.uint32_t, FFIType.ptr, FFIType.uint32_t],
			returns: FFIType.void,
		},
		get: {
			args: [FFIType.ptr, FFIType.ptr, FFIType.uint32_t, FFIType.ptr],
			returns: FFIType.ptr,
		},
		remove: {
			args: [FFIType.ptr, FFIType.ptr, FFIType.uint32_t],
			returns: FFIType.void,
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

	put(key: string | Buffer, value: Buffer) {
		if (!this.db) return
		const keyBuffer = key instanceof Buffer ? key : Buffer.from(key)
		put(this.db, keyBuffer, keyBuffer.byteLength, value, value.byteLength)
	}

	get(key: string | Buffer): Buffer | null {
		if (!this.db) return null
		const keyBuffer = key instanceof Buffer ? key : Buffer.from(key)
		const valueLengthBuffer = new Uint32Array(1)
		const result = get(this.db, keyBuffer, keyBuffer.byteLength, ptr(valueLengthBuffer))
		const length = valueLengthBuffer[0]
		// console.log("length:", length, result)
		if (result) {
			// memory should automatically be freed since we now have a Javascript buffer
			return Buffer.from(toArrayBuffer(result, 0, length))
		} else {
			return null
		}
	}

	delete(key: string | Buffer) {
		if (!this.db) return
		const keyBuffer = key instanceof Buffer ? key : Buffer.from(key)
		remove(this.db, keyBuffer, keyBuffer.byteLength)
	}

	close() {
		if (this.db == null) return
		close_database(this.db)
		this.db = null
	}

	static test() {
		const db = new RocksDB("bun-rocks-c.db")

		const key = "hello"
		const value = Buffer.from("World!!!")

		console.log(`Putting key ${key} with value ${value}`)
		db.put("hello", value)

		console.log(`Getting key ${key}`)
		const value2 = db.get(key)

		console.log("Value:", value2)

		db.close()
	}
}

// RocksDB.test()
