import React from "react"
import { Link } from "react-router-dom"
import BooksPage, { bookLoader } from "/imports/Books/Books.page"
import routesFrom from "/imports/Common/routesFrom"
import { Container } from "@mantine/core"

const HomeRoutes = [
  {
    path: "/books",
    loader: bookLoader,
    element: (data) => <BooksPage data={data} />
  }
]

// Roll up child routes so that relevant data loaders can be called on
// the server.
const AllRoutes = [...HomeRoutes]

function HomePage({ data }) {
  return (
    <Container>
      <h1>Meteor Booklist</h1>

      <p>
        <Link to="/books" className="underline">
          Book list
        </Link>
      </p>

      <div>
        {
          // This method generates client-side routes.
          routesFrom(HomeRoutes, data)
        }
      </div>
    </Container>
  )
}

export { HomeRoutes, AllRoutes }
export default HomePage
