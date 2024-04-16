import React from "react"
import { onPageLoad } from "meteor/server-render"
import { WebApp } from "meteor/webapp"
import ReactDOMServer from "react-dom/server"
import { StaticRouter } from "react-router-dom/server"
import bodyParser from "body-parser"
import App, { AllRoutes } from "/imports/App/App"
import UrlPattern from "url-pattern"

WebApp.connectHandlers.use(bodyParser.json())

onPageLoad(async (sink) => {
  let data = null

  for (const { path, loader } of AllRoutes) {
    if (
      new UrlPattern(path).match(sink?.request?.path) &&
      typeof loader === "function"
    ) {
      const newData = await loader()

      data = {
        ...data,
        ...newData
      }
    }
  }

  sink.renderIntoElementById(
    "app",
    ReactDOMServer.renderToString(
      <StaticRouter location={sink.request.url}>
        <App data={data} />
      </StaticRouter>
    )
  )

  sink.appendToBody(`
    <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  `)
})
