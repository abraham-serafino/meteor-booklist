import React from "react"
import { Button, SimpleGrid, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { validateWithJoi } from "/imports/Common/ValidatedMethod"
import BooksApi, { createBookSchema } from "./Books.api"

function BookForm() {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { title: "", author: "" },

    validate(values) {
      // When the third argument to validateWithJoi() is "false,"
      // it returns an object that can be used by @mantine/form's
      // validators instead of throwing an exception.
      return validateWithJoi(values, createBookSchema, false)
    }
  })

  const handleSubmit = (values) => {
    BooksApi.createBook(values)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <SimpleGrid cols={2}>
        <TextInput
          label="Title"
          placeholder="Title"
          {...form.getInputProps("title")}
        />

        <TextInput
          label="Author"
          placeholder="Author"
          {...form.getInputProps("author")}
        />

        <div>{/* empty column */}</div>

        <Button title="Create Book" type="submit">
          Create
        </Button>
      </SimpleGrid>
    </form>
  )
}

export default BookForm
