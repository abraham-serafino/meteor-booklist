import React from "react"
import { Route, Routes } from "react-router"

function routesFrom(routeList, data) {
  return (
    <Routes>
      {routeList.map(({ path, element }) => (
        <Route key={path} path={path} element={element(data)} />
      ))}
    </Routes>
  )
}

export default routesFrom
