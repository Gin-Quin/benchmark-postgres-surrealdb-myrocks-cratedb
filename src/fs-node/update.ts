import { ids } from "../utilities/getIds"
import { randomBytes } from "node:crypto"
import { open, FileHandle, writeFile } from "node:fs/promises"
import { writeFileSync } from "node:fs"
import { volume } from "../utilities/volume"

const data = ids.map(id => ({
	key: ids[0],
	value: randomBytes(1024),
}))

const filePath = `${volume}/fs-node.file`

const file = (await open(filePath, "w+")) as unknown as FileHandle

let now = Date.now()
await Promise.all(data.map(record => file.write(record.value)))
console.log("(FileHandle) Update author by id:", Date.now() - now, "ms")

file.close()

now = Date.now()
await Promise.all(data.map(record => writeFile(filePath, record.value)))
console.log("(writeFile) Update author by id:", Date.now() - now, "ms")

now = Date.now()
data.forEach(record => writeFileSync(filePath, record.value))
console.log("(writeFileSync) Update author by id:", Date.now() - now, "ms")
