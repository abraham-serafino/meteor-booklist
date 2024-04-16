import React from "react"
import BooksApi from "./Books.api"
import BookForm from "./Book.form"
import { Space } from "@mantine/core"

async function bookLoader() {
  const BooksModel = require("./Books.model").default
  const books = await BooksModel.findAll()
  return { books }
}

function BooksPage({ data }) {
  let [isLoading, books] = BooksApi.subscribe()

  if (isLoading && data?.books) {
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
