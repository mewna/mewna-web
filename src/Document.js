import React, { Component } from "react"
import { AfterRoot, AfterData } from "@jaredpalmer/after"
import { StaticRouter } from "react-router"

import { Global, css } from "@emotion/core"
import emotionNormalize from "emotion-normalize"
import { ThemeProvider } from "emotion-theming"
import { ToastProvider } from "react-toast-notifications"
import Navbar from "./comp/Navbar"
import storage from "./Storage"
import getTheme from "./Theme"

import setupIcons from "./Icons"
import Footer from "./comp/Footer"
import MewnaToast from "./comp/Toast"

setupIcons()

export default class extends Component {
  static async getInitialProps(ctx) {
    const { req, assets, data, renderPage } = ctx
    const context = {}
    const location = req.url
    storage._setStore(req.universalCookies)
    const lightTheme = storage.getLightTheme(req.headers.host)
    const theme = getTheme(lightTheme)
    const page = await renderPage(App => props => (
      <StaticRouter context={context} location={location}>
        <ThemeProvider theme={theme}>
          <Navbar />
          <App {...props} />
        </ThemeProvider>
      </StaticRouter>
    ))
    return { host: req.headers.host, assets, data, ...page }
  }

  render() {
    const { helmet, assets, data } = this.props
    // get attributes from React Helmet
    const htmlAttrs = helmet.htmlAttributes.toComponent()
    const bodyAttrs = helmet.bodyAttributes.toComponent()
    const lightTheme = storage.getLightTheme(this.props.host)
    const theme = getTheme(lightTheme)

    return (
      <html {...htmlAttrs}>
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="copyright" content="(c) amy 2018 - present" />
          <meta name="robots" content="index,follow" />
          <meta name="theme-color" content="#db325c" />
          <meta name="google-site-verification" content="-eXmBV1AjdB6VRfqMX4Dt803iuZ-6qcUhPmATiO5Zlk" />
          <meta name="keywords" content="mewna,discord,discord bot" />
          {helmet.title.toComponent() || <title>Mewna</title>}
          {helmet.meta.toComponent()}
          {helmet.link.toComponent()}
          {assets.client.css && (
            <link rel="stylesheet" href={assets.client.css} />
          )}
        </head>
        <body {...bodyAttrs}>
          <ThemeProvider theme={theme}>
            <Global
              styles={css`
                ${emotionNormalize}
                @import url('https://fonts.googleapis.com/css?family=Roboto');
                body {
                  font-family: 'Roboto', sans-serif;
                  background: ${theme.colors.med};
                  color: ${theme.colors.text};
                }
              `}
            />
            <>
              <ToastProvider
                components={{Toast: MewnaToast}}
                autoDismissTimeout={5000}
                placement="bottom-right"
              >
                <AfterRoot />
                <AfterData data={data} />
              </ToastProvider>
            </>
          </ThemeProvider>
          <Footer>(c) Mewna 2019</Footer>
          <script
            type="text/javascript"
            src={assets.client.js}
            defer
            crossOrigin="anonymous"
          />
        </body>
      </html>
    )
  }
}
