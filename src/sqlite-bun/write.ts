import { fakerDE as faker } from "@faker-js/faker"
import { escape } from "../utilities/escape"
import { ids } from "../utilities/getIds"
import { db } from "./db"

const insertauthorsQuery = db.query(
	`INSERT INTO authors (id, first_name, last_name) VALUES (?, ?, ?)`
)

const insertauthorsQuery2 = db.query(
	`INSERT INTO authors (id, first_name, last_name) VALUES ($id, $firstName, $lastName)`
)

const data = ids.map(id => ({
	$id: id,
	$firstName: escape(faker.person.firstName()),
	$lastName: escape(faker.person.lastName()),
}))

// {
// 	const now = Date.now()
// data.forEach(record =>
// 	insertauthorsQuery.run(record.$id, record.$firstName, record.$lastName)
// )
// console.log("(list) Write authors one by one:", Date.now() - now, "ms")
// }

{
	const now = Date.now()
	data.forEach(record => insertauthorsQuery2.run(record))
	console.log("(object) Write authors one by one:", Date.now() - now, "ms")
}
