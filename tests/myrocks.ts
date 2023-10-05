import  mariadb, { Connection } from 'mariadb';

const pool = mariadb.createPool({
     host: 'localhost', 
	  port: 3306,
     user: 'root', 
     password: 'secret',
     connectionLimit: 5,
	  database: 'myrocks'
});

main()

async function main() {
	const connection = await pool.getConnection();
	console.log("Connected to MyRocks")
	await initTables(connection);
	// await insertData(connection);
	// const authors = await connection.query("SELECT * FROM AUTHORS")
	// console.log("authors", authors)
	await connection.end();
}

async function insertData(connection: Connection) {
	await connection.query(`
		INSERT INTO AUTHORS VALUES
			(201, 'MATT', 'FRIED'),
			(202, 'MIKE', 'SMYLY'),
			(203, 'BRIAN', 'FREEMAN'),
			(204, 'FREDDIE', 'SNITKER'),
			(205, 'OZZIE', 'ACUNA'),
			(206, 'ROBERT', 'SWANSON'),
			(207, 'RONALD', 'ABLIES'),
			(208, 'TRAVIS', 'RILEY'), 
			(209, 'MARK', 'MINTER'),
			(210, 'TIM', 'GREENE'),
			(211, 'ARTHUR', 'RAGONE');
		
		INSERT INTO BOOKS VALUES
			(501, 'Outside In', 204, '978-3-16-134540-0', 49.99), 
			(502, 'Hit Refresh', 210, '978-3-16-156730-0', 19.99), 
			(503, 'I, Me and Myself', 205, '978-3-16-129840-0', 29.99), 
			(504, 'One Night in a Flea Market', 209, '978-3-16-12413-0', 49.99), 
			(505, 'India Before Gandhi', 210, '978-3-16-109746-0', 34.99), 
			(506, 'The Man- Eating Tiger of Champaner', 203, '978-3-16-124613-0', 19.99), 
			(507, 'How Stuff Works', 208, '978-3-16-198643-0', 9.99), 
			(508, 'Engineering Mathematics', 210, '978-3-16-126415-0', 19.99), 
			(509, 'Industrial Revolution', 205, '978-3-16-698670-0', 39.99), 
			(510, 'The Renaissance', 208, '978-3-16-129860-0', 19.99), 
			(511, 'Around the World in 54 Days', 204, '978-3-16-192410-0', 71.99), 
			(512, 'History of the Olympic Games', 203, '978-3-16-175310-0', 23.99), 
			(513, 'How to Self Heal', 211, '978-3-16-1198620', 31.99), 
			(514, 'Merry Go Round', 209, '978-3-16-129871', 4.99), 
			(515, 'Cometh the Hour', 203, '978-3-16-144317-0', 18.99), 
			(516, 'Bob and Mike', 202, '978-3-16-186410-0', 5.99), 
			(517, 'Time to Tango', 201, '978-3-16-198410-0', 8.99), 
			(518, 'Tongue and Grooves', 203, '978-3-16-126510-0', 10.99), 
			(519, 'Journey to Middle Earth', 208, '978-3-16-139810-0', 23.99), 
			(520, 'The Andes', 202, '978-3-16-115320-0', 21.99);
		`)
	 }

async function initTables(connection: Connection) {
	await connection.query("DROP DATABASE IF EXISTS myrocks")
	console.log("Dropped myrocks")
	await connection.query("CREATE DATABASE myrocks")
	console.log("Created myrocks") 

	await connection.query(`
		CREATE TABLE AUTHORS (
			id int
		);
	`)
	console.log("Created AUTHORS")

	// 	CREATE TABLE IF NOT EXISTS BOOKS
	// 	(
	// 		BOOK_ID INT PRIMARY KEY,
	// 		BOOK_NAME VARCHAR(50),
	// 		BOOK_AUTHOR INT REFERENCES AUTHORS(AUTHOR_ID),
	// 		BOOK_ISBN VARCHAR(50),
	// 		BOOK_PRICE INT
	// 	);
	// `)
}
