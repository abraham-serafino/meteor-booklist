import { WebApp } from "meteor/webapp"
import connectRoute from "connect-route"
import { validateWithJoi } from "/imports/Common/ValidatedMethod"
import BooksModel from "./Books.model"
import Joi from "joi"

const deleteBookSchema = Joi.object({
  _id: Joi.string().required()
})

WebApp.connectHandlers.use(
  "/api",
  connectRoute((router) => {
    router.get("/books", async (request, response) => {
      const books = await BooksModel.findAll()
      return response.writeHead(200).end(JSON.stringify(books))
    })

    router.delete("/book/:_id", async (request, response) => {
      // Throw a Meteor exception if request.params doesn't
      // match deleteBookSchema.
      validateWithJoi(request.params, deleteBookSchema)

      try {
        await BooksModel.deleteBook(request.params)
        return response.writeHead(200).end()
      } catch (e) {
        return response.writeHead(500).end(JSON.stringify(e))
      }
    })
  })
)
