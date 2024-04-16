import { Mongo } from "meteor/mongo"
import useMeteorSubscription from "/imports/Common/useMeteorSubscription"
import {
  ValidatedMethod,
  validateWithJoi
} from "/imports/Common/ValidatedMethod"
import Joi from "joi"

// These can only be imported on the server.
let WebApp = {}
let BooksModel = {}
let connectRoute = {}
let publishWithPolling = {}

const BOOKS = {
  FIND_ALL: "books.findAll",
  CREATE: "book.create"
}

const Books = new Mongo.Collection(BOOKS.FIND_ALL)

if (Meteor.isServer) {
  // Server-only imports.
  WebApp = require("meteor/webapp").WebApp
  connectRoute = require("connect-route")
  BooksModel = require("/imports/Books/Books.model").default

  publishWithPolling =
    require("/imports/Common/publishWithPolling").default

  Meteor.startup(async () => {
    // Create some sample data when the server starts.
    const result = await BooksModel.findAll()

    if (!result?.length) {
      await BooksModel.createBook({
        author: "John Bunyan",
        title: "The Pilgrim's Progress"
      })

      await BooksModel.createBook({
        author: "Jesus Christ",
        title: "Bible"
      })

      await BooksModel.createBook({
        author: "Dale Carnegie",
        title: "How to Win Friends and Influence People"
      })
    }
  })

  // Initialize book-related REST endpoints.
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

  // This convenience method can create a Meteor publication
  // that polls any data source.
  publishWithPolling({
    publicationName: BOOKS.FIND_ALL,
    getData: () => BooksModel.findAll(),
    useNumericKeys: true
  })
}

const deleteBookSchema = Joi.object({
  _id: Joi.string().required()
})

const createBookSchema = Joi.object({
  author: Joi.string().required(),
  title: Joi.string().required()
})

async function createBookMethod({ author, title }) {
  if (Meteor.isServer) {
    // On the server side, we will insert the book into the database.
    await BooksModel.createBook({ author, title })
  } else {
    // On the client side, we will optimistically insert the new
    // record into our collection until it is replaced with
    // subscription data.
    Books.insert({ author, title })
  }
}

const BooksApi = {
  subscribe() {
    // useMeteorSubscription() synchronizes client-side collections
    // with server-side publications.
    return useMeteorSubscription({
      // This is the client-side collection.
      Collection: Books,
      // This is the name of the server-side publication.
      subscriptionName: BOOKS.FIND_ALL
    })
  },

  // This convenience method creates a new, isomorphic Meteor method,
  // and a client-side function that can call it - like this:
  //
  //    BooksApi.createBook({ author, title })
  //
  createBook: ValidatedMethod(
    BOOKS.CREATE,
    createBookMethod,
    // Arguments passed to the new function will be validated using
    // this schema.
    createBookSchema
  )
}

export { createBookSchema, deleteBookSchema }
export default BooksApi
