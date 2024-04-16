import React from "react"
import HomePage, { AllRoutes as AllHomeRoutes } from "./Home.page"
import routesFrom from "/imports/Common/routesFrom"
import { MantineProvider } from "@mantine/core"

const AppRoutes = [
  {
    path: "*",
    element(data) {
      return <HomePage data={data} />
    }
  }
]

// Roll up child routes so that data loaders can be called on the
// server.
const AllRoutes = [...AppRoutes, ...AllHomeRoutes]

function App({ data }) {
  return (
    <MantineProvider>
      {
        // This convenience method generates isomorphic routes
        // for React Router.
        routesFrom(AppRoutes, data)
      }
    </MantineProvider>
  )
}

export { AppRoutes, AllRoutes }
export default App
