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

  // Call the data loaders from all the exported routes that match
  // the current URL path. Then aggregate the results into a giant
  // "data" object.
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
        {/* Server-side: pass the aggregated route loader data
        into the component tree as props. */}
        <App data={data} />
      </StaticRouter>
    )
  )

  sink.appendToBody(`
    <script>
        // Client-side: attach the stringified loader data to the window
        // so that it can be retrieved by hydration logic 
        window.__PRELOADED_STATE__ = ${JSON.stringify(data).replace(/</g, "\\u003c")}
    </script>
  `)
})
