import { open } from "sqlite"
import sqlite3 from "sqlite3"

let _db = null

async function db() {
  if (_db === null) {
    _db = await open({
      filename: "./meteor-booklist.db",
      driver: sqlite3.Database
    })

    let result = await _db.get(
      `SELECT *
           FROM sqlite_master
           WHERE name = ?
      `,
      "book"
    )

    if (!result) {
      await _db.exec(`
          CREATE TABLE book
          (
            _id    INTEGER PRIMARY KEY AUTOINCREMENT,
            title  TEXT,
            author TEXT
          )
        `)
    }
  }

  return _db
}

export default db
