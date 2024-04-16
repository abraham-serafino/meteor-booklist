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

const AllRoutes = [...AppRoutes, ...AllHomeRoutes]

function App({ data }) {
  return (
    <MantineProvider>{routesFrom(AppRoutes, data)}</MantineProvider>
  )
}

export { AppRoutes, AllRoutes }
export default App
