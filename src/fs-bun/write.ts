import { ids } from "../utilities/getIds"
import { randomBytes } from "node:crypto"
import { open, FileHandle, writeFile } from "node:fs/promises"
import { writeFileSync } from "node:fs"
import { volume } from "../utilities/volume"

const data = ids.map(id => ({
	key: id,
	value: randomBytes(1024),
}))

const filePath = (id: string) => `${volume}/fs-bun-${id}.file`

let now = Date.now()
await Promise.all(
	data.map(async record => {
		// console.log("record.key", record.key)
		const file = (await open(filePath(record.key), "w+")) as unknown as FileHandle
		await file.write(record.value)
		await file.close()
	})
)
console.log("(FileHandle) Write author:", Date.now() - now, "ms")

now = Date.now()
await Promise.all(data.map(record => Bun.write(filePath(record.key), record.value)))
console.log("(Bun.write) Write author:", Date.now() - now, "ms")

now = Date.now()
await Promise.all(data.map(record => writeFile(filePath(record.key), record.value)))
console.log("(writeFile) Write author:", Date.now() - now, "ms")

now = Date.now()
data.forEach(record => writeFileSync(filePath(record.key), record.value))
console.log("(writeFileSync) Write author:", Date.now() - now, "ms")
