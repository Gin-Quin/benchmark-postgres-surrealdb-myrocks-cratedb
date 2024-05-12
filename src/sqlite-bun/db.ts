import Database from "bun:sqlite"
import { volume } from "../utilities/volume"

export const db = new Database(`${volume}/db-bun.sqlite`)

db.exec("PRAGMA journal_mode = WAL;")

db.exec(`DROP TABLE IF EXISTS BOOKS;`)
db.exec(`DROP TABLE IF EXISTS authors;`)
db.exec(`CREATE TABLE authors
	(
		id text PRIMARY KEY, 
		first_name text,
		last_name text
	);`)
db.exec(`CREATE TABLE BOOKS
	(
		id text PRIMARY KEY,
		name text,
		author text REFERENCES authors(id),
		isnb text,
		price int
	);`)
