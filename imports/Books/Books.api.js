import { Mongo } from "meteor/mongo"
import useMeteorSubscription from "/imports/Common/useMeteorSubscription"
import {
  ValidatedMethod,
  validateWithJoi
} from "/imports/Common/ValidatedMethod"
import Joi from "joi"

const BOOKS = {
  FIND_ALL: "books.findAll",
  CREATE: "book.create"
}

const Books = new Mongo.Collection(BOOKS.FIND_ALL)
let BooksModel = {}
let publication = {}

if (Meteor.isServer) {
  const { WebApp } = require("meteor/webapp")
  const connectRoute = require("connect-route")
  BooksModel = require("/imports/Books/Books.model").default

  const publishWithPolling =
    require("/imports/Common/publishWithPolling").default

  //
  ;(async () => {
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
  })()

  WebApp.connectHandlers.use(
    "/api",
    connectRoute((router) => {
      router.get("/books", async (request, response) => {
        return response
          .writeHead(200)
          .end(JSON.stringify(await BooksModel.findAll()))
      })

      router.delete("/book/:_id", async (request, response) => {
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

  publishWithPolling({
    collectionName: BOOKS.FIND_ALL,
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
    const newBook = await BooksModel.createBook({ author, title })
    publication.added(BOOKS.FIND_ALL, newBook._id, newBook)
  } else {
    Books.insert({ author, title })
  }
}

const BooksApi = {
  subscribe() {
    return useMeteorSubscription({
      Collection: Books,
      subscriptionName: BOOKS.FIND_ALL
    })
  },

  createBook: ValidatedMethod(
    BOOKS.CREATE,
    createBookMethod,
    createBookSchema
  )
}

export { createBookSchema, deleteBookSchema }
export default BooksApi
