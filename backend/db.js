import Database from "better-sqlite3";

//the actual database
const db = new Database('vault.db')


/**
 * each line inside is a column
 * PRIMARY KEY AUTOINCREMENT  - every row gets a unique id automatically
 * FOREIGN KEY - links entries back to a user
 */
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        salt TEXT NOT NULL
    )
`)

db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        encrypted_data TEXT NOT NULL,
        iv TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`)

console.log('Database ready!')

export default db