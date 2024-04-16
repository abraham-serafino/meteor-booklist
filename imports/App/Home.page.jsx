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

      <div>{routesFrom(HomeRoutes, data)}</div>
    </Container>
  )
}

export { HomeRoutes, AllRoutes }
export default HomePage
