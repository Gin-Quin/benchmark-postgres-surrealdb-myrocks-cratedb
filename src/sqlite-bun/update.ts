import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "../utilities/escape"
import { ids } from "../utilities/getIds"
import { db } from "./db"

const insertAuthorQuery = db.query(
	`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
)

const updateAuthorQuery = db.query(
	`UPDATE authors SET first_name = $firstName, last_name = $lastName WHERE id = $id`
)

const data = ids.map(() => ({
	$id: ids[0],
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
}))

insertAuthorQuery.run({
	$id: ids[0],
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
})

const now = Date.now()
data.forEach(record => updateAuthorQuery.run(record))
console.log("Update author by id:", Date.now() - now, "ms")
