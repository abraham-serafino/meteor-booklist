import { WebApp } from "meteor/webapp"
import connectRoute from "connect-route"
import { validateWithJoi } from "/imports/Common/ValidatedMethod"
import BooksModel from "./Books.model"
import { createBookSchema } from "./Books.api"

WebApp.connectHandlers.use(
  "/api",
  connectRoute((router) => {
    router.get("/books", async (request, response) => {
      const books = await BooksModel.findAll()
      return response.writeHead(200).end(JSON.stringify(books))
    })

    router.delete("/book", async (request, response) => {
      // Throw a Meteor exception if request.params doesn't
      // match createBookSchema.
      validateWithJoi(request.query, createBookSchema)
      const { author, title } = request.query

      try {
        await BooksModel.deleteBook({ author, title })
        return response.writeHead(200).end()
      } catch (e) {
        return response.writeHead(500).end(JSON.stringify(e))
      }
    })
  })
)
