import { ids } from "../utilities/getIds"
import { randomBytes } from "node:crypto"
import { writeFile } from "node:fs/promises"
import { volume } from "../utilities/volume"

const filePath = (id: string) => `${volume}/fs-bun-${id}.file`

const data = ids.map(id => ({
	key: filePath(id),
	value: randomBytes(1024),
}))

// {
// 	const now = Date.now()
// 	await Promise.all(
// 		data.map(async record => {
// 			// console.log("record.key", record.key)
// 			const file = (await open(record.key, "w+")) as unknown as FileHandle
// 			await file.write(record.value)
// 			await file.close()
// 		})
// 	)
// 	console.log("(FileHandle) Write author:", Date.now() - now, "ms")
// }

// {
// 	const now = Date.now()
// 	await Promise.all(data.map(record => Bun.write(record.key, record.value)))
// 	console.log("(Bun.write) Write author:", Date.now() - now, "ms")
// }

{
	const now = Date.now()
	await Promise.all(data.map(record => writeFile(record.key, record.value)))
	console.log("(writeFile) Write author:", Date.now() - now, "ms")
}

// {
// 	const now = Date.now()
// 	data.forEach(record => writeFileSync(record.key, record.value))
// 	console.log("(writeFileSync) Write author:", Date.now() - now, "ms")
// }
