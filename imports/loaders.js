import BooksModel from "./Books/Books.model"
import UrlPattern from "url-pattern"

const loaders = [
  {
    path: new UrlPattern("/books"),
    handler: async () => {
      const books = await BooksModel.findAll()
      return { books }
    }
  }
]

export default loaders
