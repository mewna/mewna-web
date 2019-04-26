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
import styled from "@emotion/styled"
import { PaddedCard } from "./comp/Card"
import { darkBackground } from "./comp/Utils"

const MewnaBaseToast = styled(PaddedCard)`
  width: 360px;
  line-height: 1.4;
  min-height: 40px;
  margin: 0.5em;
  user-select: none;
  ${darkBackground}

  @media screen and (max-width: 768px) {
    width: 100vw;
    margin-top: 1em !important;
    margin-bottom: -0.5em;
    margin-right: -0.5em;
    margin-left: 0;
  }
`
const MewnaSuccessToast = styled(MewnaBaseToast)`
`
const MewnaErrorToast = styled(MewnaBaseToast)`
`
const MewnaToast = props => {
  const { appearance, children } = props
  const Comp = appearance == "error" ? MewnaErrorToast : MewnaSuccessToast
  return (
    <Comp onClick={() => props.onDismiss && props.onDismiss()}>
      {children}
    </Comp>
  )
}

export default class extends Component {
  static async getInitialProps(ctx) {
    const { req, assets, data, renderPage } = ctx
    const context = {}
    const location = req.url
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
          <title>Mewna</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {helmet.title.toComponent()}
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
              ></ToastProvider>
              <AfterRoot />
              <AfterData data={data} />
            </>
          </ThemeProvider>
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
