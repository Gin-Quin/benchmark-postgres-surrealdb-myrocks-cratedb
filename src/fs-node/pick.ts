import { ids } from "../utilities/getIds"
import { open, FileHandle, readFile } from "node:fs/promises"
import { readFileSync } from "node:fs"
import { volume } from "../utilities/volume"

const filePath = (id: string) => `${volume}/${id}.node`

let now = Date.now()
await Promise.all(
	ids.map(async id => {
		const file = (await open(filePath(id), "w+")) as unknown as FileHandle
		const content = await file.readFile()
		await file.close()
		return content
	})
)
console.log("(FileHandle) Pick author by id:", Date.now() - now, "ms")

now = Date.now()
await Promise.all(ids.map(id => readFile(filePath(id))))
console.log("(readFile) Pick author by id:", Date.now() - now, "ms")

now = Date.now()
ids.forEach(id => readFileSync(filePath(id)))
console.log("(readFileSync) Pick author by id:", Date.now() - now, "ms")
