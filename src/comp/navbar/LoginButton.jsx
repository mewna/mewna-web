import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import NavButton from "./NavButton"
import store from "../../Storage"
import { backendUrl } from "../../Const"
import api from "../../Api"

export default class extends Component {
  componentDidMount() {
    if (typeof window !== undefined) {
      window.addEventListener("message", this.handleLoginMessage.bind(this))
    }
  }

  componentWillUnmount() {
    if (typeof window !== undefined) {
      window.removeEventListener("message", this.handleLoginMessage.bind(this))
    }
  }

  render() {
    return <NavButton onClick={e => this.createOAuthDialog(e)}>Log in</NavButton>
  }

  createOAuthDialog(e) {
    e.preventDefault()
    if (typeof window !== undefined) {
      const hostname = api.clientHostname()
      window.open(
        `${backendUrl(hostname)}/api/oauth/login/start`,
        "Discord login",
        "resizable=no,menubar=no,scrollbars=yes,status=no,height=600,width=400"
      )
    }
  }

  handleLoginMessage(e) {
    const data = e.data
    if (data.type === "login") {
      store.setToken(data.token, window.location.hostname)
    }
  }
}
