import React from "react"
import BooksApi from "./Books.api"
import BookForm from "./Book.form"
import { Space } from "@mantine/core"

// Generate server-side data for SSR.
async function bookLoader() {
  // This module can only be imported on the server.
  const BooksModel = require("./Books.model").default
  const books = await BooksModel.findAll()
  return { books }
}

function BooksPage({ data }) {
  let [isLoading, books] = BooksApi.subscribe()

  if (isLoading && data?.books) {
    // Display server-rendered data until the client-side subscription
    // has finished loading.
    books = data.books
  }

  return (
    <div>
      <BookForm />

      <Space h="md" />

      {books?.map(({ title, author }) => {
        return (
          <div key={`${title} - ${author}`}>
            <i>"{title}"</i> - {author}
          </div>
        )
      })}
    </div>
  )
}

export { bookLoader }
export default BooksPage
