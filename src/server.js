import express from "express"
import cookiesMiddleware from "universal-cookie-express"
import { render } from "@jaredpalmer/after"
import routes from "./routes"

import Document from "./Document"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

const server = express()
server
  .disable("x-powered-by")
  .use(cookiesMiddleware())
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    try {
      const html = await render({
        req,
        res,
        routes,
        assets,
        document: Document,
        // Anything else you add here will be made available
        // within getInitialProps(ctx)
        // e.g a redux store...
        customThing: "thing"
      })
      res.send(html)
    } catch (error) {
      console.error("Caught error:", error)
      res.json(error)
    }
  })

export default server
