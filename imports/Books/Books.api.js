import { Mongo } from "meteor/mongo"
import useMeteorSubscription from "/imports/Common/useMeteorSubscription"
import { ValidatedMethod } from "/imports/Common/ValidatedMethod"
import Joi from "joi"

const BOOKS = {
  FIND_ALL: "books.findAll",
  CREATE: "books.create",
  DELETE: "books.delete"
}

const Books = new Mongo.Collection(BOOKS.FIND_ALL)

if (Meteor.isServer) {
  // These can only be imported on the server.
  const BooksModel = require("/imports/Books/Books.model").default
  const publishWithPolling =
    require("/imports/Common/publishWithPolling").default

  // Initialize book-related REST endpoints.
  require("./Books.rest")

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

  // This convenience method can create a Meteor publication
  // that polls any data source.
  publishWithPolling({
    publicationName: BOOKS.FIND_ALL,
    getData: () => BooksModel.findAll(),
    useNumericKeys: true
  })
}

const createBookSchema = Joi.object({
  author: Joi.string().required(),
  title: Joi.string().required()
})

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
  // The payload ({ author, title }) will be validated against
  // createBookSchema.
  createBook: ValidatedMethod(
    BOOKS.CREATE,
    async ({ author, title }) => {
      if (Meteor.isServer) {
        // sqLite DB only exists on the server.
        const BooksModel = require("./Books.model").default
        await BooksModel.createBook({ author, title })
      }
    },
    createBookSchema
  ),

  async deleteBook(book) {
    // In case you'd rather call a RESTful endpoint than use Meteor methods,
    // here's how to do it.
    if (Meteor.isClient) {
      const axios = require("axios").default

      await axios.delete(
        `/api/book?title=${book.title}&author=${book.author}`
      )
    }
  }
}

export { createBookSchema }
export default BooksApi
