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

  const handleAddBook = async (values) => {
    // Optimistically insert the new record into our collection until
    // it is replaced with subscription data.
    setBooks([...books, values])
    BooksApi.createBook(values)
  }

  const handleDelete = async (id) => {
    setBooks(books.filter(({ _id }) => _id !== id))
    await BooksApi.deleteBook(id)
  }

  return (
    <div>
      <BookForm addBook={handleAddBook} />

      <Space h="md" />

      {books?.map(({ _id, title, author }) => {
        return (
          <div key={`${title} - ${author}`}>
            <i>"{title}"</i> - {author}{" "}
            <Anchor onClick={() => handleDelete(_id)}>X</Anchor>
          </div>
        )
      })}
    </div>
  )
}

export { bookLoader }
export default BooksPage
