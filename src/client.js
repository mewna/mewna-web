import React from "react"
import { hydrate } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { ensureReady, After } from "@jaredpalmer/after"
// import './client.css'
import routes from "./routes"
import storage from "./Storage"
import getTheme from "./Theme"
import Navbar from "./comp/Navbar"
import { ThemeProvider } from "emotion-theming"

ensureReady(routes).then(data => {
  const lightTheme = storage.getLightTheme(window.location.host)
  const theme = getTheme(lightTheme)
  hydrate(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Navbar />
        <After data={data} routes={routes} />
      </ThemeProvider>
    </BrowserRouter>,
    document.getElementById("root")
  )
})

if (module.hot) {
  module.hot.accept()
}
