import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "../utilities/escape"
import { ids } from "../utilities/getIds"
import Database from "better-sqlite3"
import { volume } from "../utilities/volume"

const db = new Database(`${volume}/db-node.sqlite`)

const insertAuthorQuery = db.prepare(
	`INSERT INTO authors (id, first_name, last_name) VALUES (?, ?, ?)`
)

const updateAuthorQuery = db.prepare(
	`UPDATE authors SET first_name = ?, last_name = ? WHERE id = ?`
)

const data = ids.map(() => ({
	$id: ids[0],
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
}))

insertAuthorQuery.run(
	escape(faker.person.firstName()),
	escape(faker.person.lastName()),
	ids[0]
)

const now = Date.now()
data.forEach(record =>
	updateAuthorQuery.run(record.$firstName, record.$lastName, record.$id)
)
console.log("Update author by id:", Date.now() - now, "ms")
