import { validateWithJoi } from "/imports/Common/ValidatedMethod"
import getDb from "/imports/Common/db"
import { createBookSchema, deleteBookSchema } from "./Books.api"

async function findOne({ author, title }) {
  validateWithJoi({ author, title }, createBookSchema)
  const db = await getDb()

  return db.get(
    `
    SELECT *
        FROM book
        WHERE author = ? AND title = ?
  `,
    author,
    title
  )
}

async function findAll() {
  const db = await getDb()

  return db.all(`
    SELECT *
    FROM book
  `)
}

async function createBook({ author, title }) {
  validateWithJoi({ author, title }, createBookSchema)
  const db = await getDb()

  const existing = await findOne({ author, title })

  if (existing) {
    await db.run(
      `
      UPDATE book
        SET author = ?, title = ?
        WHERE _id = ?
    `,
      author,
      title,
      existing._id
    )
  } else {
    await db.run(
      `
      INSERT INTO book (author, title)
        VALUES (?, ?)
    `,
      author,
      title
    )
  }

  return findOne({ author, title })
}

async function deleteBook({ _id }) {
  validateWithJoi({ _id }, deleteBookSchema)

  const db = await getDb()

  return db.run(
    `
    DELETE FROM book
        WHERE _id = ?
  `,
    _id
  )
}

export default {
  createBook,
  createBookSchema,
  findOne,
  findAll,
  deleteBook
}
