import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "../utilities/escape"
import { ids } from "../utilities/getIds"
import { db } from "./db"

const insertauthorsQuery = db.query(
	`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
)

const data = ids.map(id => ({
	$id: id,
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
}))

const now = Date.now()
db.transaction(() => data.forEach(record => insertauthorsQuery.run(record)))
console.log("Write authors by batch:", Date.now() - now, "ms")
