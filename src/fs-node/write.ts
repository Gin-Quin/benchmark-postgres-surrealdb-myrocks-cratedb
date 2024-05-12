import { ids } from "../utilities/getIds"
import { randomBytes } from "node:crypto"
import { open, FileHandle, writeFile } from "node:fs/promises"
import { writeFileSync } from "node:fs"
import { volume } from "../utilities/volume"

const data = ids.map(id => ({
	key: id,
	value: randomBytes(1024),
}))

const filePath = (id: string) => `${volume}/fs-node-${id}.file`

// {
// 	const now = Date.now()
// 	await Promise.all(
// 		data.map(async record => {
// 			const file = (await open(filePath(record.key), "w+")) as unknown as FileHandle
// 			await file.write(record.value)
// 			await file.close()
// 		})
// 	)
// 	console.log("(FileHandle) Write author:", Date.now() - now, "ms")
// }

{
	const now = Date.now()
	await Promise.all(data.map(record => writeFile(filePath(record.key), record.value)))
	console.log("(writeFile) Write author:", Date.now() - now, "ms")
}

// {
// 	const now = Date.now()
// 	data.forEach(record => writeFileSync(filePath(record.key), record.value))
// 	console.log("(writeFileSync) Write author:", Date.now() - now, "ms")
// }
