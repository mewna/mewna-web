import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import { Route } from "react-router-dom"
import Switch from "react-router/Switch"
import { withRouter } from "react-router"

import { Global, css } from "@emotion/core"
import styled from "@emotion/styled"
import emotionNormalize from "emotion-normalize"
import { ThemeProvider } from "emotion-theming"
import { Helmet } from "react-helmet"
import merge from "lodash.merge"
import { ToastProvider } from "react-toast-notifications"

import getTheme from "./Theme"
import storage from "./Storage"
import setupIcons from "./Icons"

import Navbar from "./comp/Navbar"
import Footer from "./comp/Footer"
import { PaddedCard } from "./comp/Card"
import { darkBackground } from "./comp/Utils"

import Index from "./pages/Index"
import Docs from "./pages/Docs"
import Placeholder from "./pages/Placeholder"
import ServerPage from "./pages/server/ServerPage"


// TODO: OpenGraph: http://ogp.me

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

const MewnaRoute = withRouter(class extends Component {
  render() {
    const { component: Component, ...rest } = this.props
    // console.log(staticProps)
    return (
      <Route {...rest} render={props => {
        let staticProps = {}
        if(this.props.staticContext) {
          if(Component.getInitialProps) {
            staticProps = Component.getInitialProps(this.props.staticContext.injected)
          }
        }
        const merged = merge(props, {initialProps: staticProps})
        return (
          <Component {...merged} />
        )
      }}/>
    )
  }
})

setupIcons()

export default class App extends Component {
  static async getInitialProps(ctx) {
    // const { req, res, app, isServer, fullPath, path, query } = ctx
    const { req, app } = ctx
    return {
      // Fetch from cookies ahead of time, that way the initial render will
      // always be correct
      host: req.headers.host,
      lightTheme: storage.getLightTheme(),
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      light: this.props.lightTheme,
      theme: getTheme(this.props.lightTheme)
    }
  }

  handleCookieUpdate({ name, value, options }) {
    if (name === storage.getLightThemeKey()) {
      this.setState({
        light: storage.getLightTheme(),
        theme: getTheme(storage.getLightTheme())
      })
    }
  }

  async componentDidMount() {
    this.setState({
      light: storage.getLightTheme(),
      theme: getTheme(storage.getLightTheme())
    })
    storage.addListener(this.handleCookieUpdate.bind(this))
  }

  componentWillUnmount() {
    storage.removeListener(this.handleCookieUpdate.bind(this))
  }

  render() {
    return (
      <ThemeProvider theme={this.state.theme}>
        <Helmet>
          <title>Mewna</title>
        </Helmet>
        <Global
          styles={css`
            ${emotionNormalize}
            @import url('https://fonts.googleapis.com/css?family=Roboto');
            body {
              font-family: 'Roboto', sans-serif;
              background: ${this.state.theme.colors.med};
              color: ${this.state.theme.colors.text};
            }
          `}
        />
        <Navbar />
        <>
          <ToastProvider
            components={{Toast: MewnaToast}}
            autoDismissTimeout={5000}
            placement="bottom-right"
          >
            <Switch>
              <MewnaRoute exact path="/" component={Index} />
              <MewnaRoute exact path="features" component={Placeholder} />
              <MewnaRoute exact path="/docs" component={Docs} />
              <MewnaRoute exact path="/about" component={Placeholder} />
              <MewnaRoute exact path="/about/terms" component={Placeholder} />
              <MewnaRoute exact path="/about/brand" component={Placeholder} />

              <MewnaRoute exact path="/home" component={Placeholder} />
              <MewnaRoute exact path="/home/logs" component={Placeholder} />
              
              <MewnaRoute exact path="/server/:id/:key?/:subkey?" component={ServerPage} />

              <MewnaRoute exact path="/user/:id" component={Placeholder} />
              <MewnaRoute exact path="/user/:id/:post" component={Placeholder} />
            </Switch>
          </ToastProvider>
        </>
        <Footer>(c) Mewna 2019</Footer>
      </ThemeProvider>
    )
  }
}
