import React, { useState, useEffect } from "react"
import BooksApi from "./Books.api"
import BookForm from "./Book.form"
import { Anchor, Space } from "@mantine/core"

// Generate server-side data for SSR.
async function bookLoader() {
  // This module can only be imported on the server.
  const BooksModel = require("./Books.model").default
  const books = await BooksModel.findAll()
  return { books }
}

function BooksPage({ data }) {
  let [isLoading, bookResults] = BooksApi.subscribe()
  // Display server-rendered data until the client-side subscription
  // has finished loading.
  const [books, setBooks] = useState(data?.books)

  useEffect(() => {
    if (!isLoading && bookResults?.length) {
      setBooks(bookResults)
    }
  }, [isLoading, (bookResults || []).length])

  const handleAddBook = async (newBook) => {
    // Optimistically insert the new record into our collection until
    // it is replaced with subscription data.
    setBooks([...books, newBook])
    BooksApi.createBook(newBook)
  }

  const handleDelete = async (book) => {
    setBooks(
      books.filter(
        ({ author, title }) =>
          title !== book.title || author !== book.author
      )
    )

    await BooksApi.deleteBook(book)
  }

  return (
    <div>
      <BookForm addBook={handleAddBook} />

      <Space h="md" />

      {books?.map(({ title, author }) => {
        return (
          <div key={`${title} - ${author}`}>
            <i>"{title}"</i> - {author}{" "}
            <Anchor onClick={() => handleDelete({ author, title })}>
              X
            </Anchor>
          </div>
        )
      })}
    </div>
  )
}

export { bookLoader }
export default BooksPage
