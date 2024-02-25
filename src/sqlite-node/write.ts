import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "../utilities/escape"
import { ids } from "../utilities/getIds"
import Database from "better-sqlite3"
import { volume } from "../utilities/volume"

const db = new Database(`${volume}/db-node.sqlite`)

const insertauthorsQuery = db.prepare(
	`INSERT INTO authors (id, first_name, last_name) VALUES (?, ?, ?)`
)

const data = ids.map(id => ({
	$id: id,
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
}))

const now = Date.now()
data.forEach(record =>
	insertauthorsQuery.run(record.$id, record.$firstName, record.$lastName)
)
console.log("Write authors one by one:", Date.now() - now, "ms")
