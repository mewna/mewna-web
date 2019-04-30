import React, { Component } from "react"
import { hydrate } from "react-dom"
import { BrowserRouter } from "react-router-dom"
import { ensureReady, After } from "@jaredpalmer/after"
// import './client.css'
import routes from "./routes"
import storage from "./Storage"
import getTheme from "./Theme"
import Navbar from "./comp/Navbar"
import MewnaToast from "./comp/Toast"
import { ThemeProvider } from "emotion-theming"
import { ToastProvider } from "react-toast-notifications"
import { Global, css } from "@emotion/core"

import setupIcons from "./Icons"

setupIcons()

class WrappedThemeProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      theme: props.theme,
    }
  }

  componentDidMount() {
    storage.register(this)
  }

  componentWillUnmount() {
    storage.unregister(this)
  }

  updateRender() {
    const lightTheme = storage.getLightTheme(window.location.host)
    const theme = getTheme(lightTheme)
    this.setState({theme: theme})
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <Global
            styles={css`
              body {
                background: ${this.state.theme.colors.med};
                color: ${this.state.theme.colors.text};
              }
            `}
          />
        {this.props.children}
      </ThemeProvider>
    )
  }
}

ensureReady(routes).then(data => {
  const lightTheme = storage.getLightTheme(window.location.host)
  const theme = getTheme(lightTheme)
  hydrate(
    <BrowserRouter>
      <WrappedThemeProvider theme={theme}>
        <ToastProvider
          components={{Toast: MewnaToast}}
          autoDismissTimeout={5000}
          placement="bottom-right"
        >
          <Navbar />
          <After data={data} routes={routes} />
        </ToastProvider>
      </WrappedThemeProvider>
    </BrowserRouter>,
    document.getElementById("root")
  )
})

if (module.hot) {
  module.hot.accept()
}
