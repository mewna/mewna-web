import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import Container from "./Container"
import FlexPadder from "./FlexPadder"
import NavLink, { ExternalLink } from "./NavLink"
import LoginButton from "./navbar/LoginButton"
import UserMenu from "./navbar/UserMenu"
import { HiddenMobile } from "./HiddenMobile"
import PremiumSettings from "./PremiumSettings"

import { css } from "@emotion/core"
import styled from "@emotion/styled"

import store from "../Storage"
import api from "../Api"
import $ from "../Translate"

const topBorder = props => {
  return css`
    border-top: 2px solid ${props.theme.colors.brand};
  `
}
const BAR_HEIGHT = 48
const Bar = styled.div`
  padding-top: 0.5em;
  width: 100%;
  height: ${BAR_HEIGHT}px;
  display: flex;
  align-content: center;
  align-items: center;
  ${topBorder}

  @media screen and (max-width: 768px) {
    padding-left: 1em;
    padding-right: 1em;
    width: calc(100% - 2em);
  }
`
const NavTitle = styled.div`
  font-size: 2.25em;
`
const NavItem = styled.div`
  height: ${BAR_HEIGHT};
  display: flex;
  align-items: center;
  padding-left: 0.5em;
  padding-right: 0.5em;
`

export default class Navbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
      account: null,
      modal: false,
    }
    this.modalHooks = []
  }

  addModalHook(hook) {
    this.modalHooks.push(hook)
  }

  removeModalHook(hook) {
    this.modalHooks = this.modalHooks.filter(e => e !== hook)
  }

  async componentDidMount() {
    store.register(this)
    await this.updateRender()
  }

  componentWillUnmount() {
    store.unregister(this)
  }

  async updateRender() {
    const user = await api.heartbeat(api.clientHostname())
    let account = null
    if(user) {
      account = await api.getUser(api.clientHostname(), user.id)
    }
    this.setState({user: user, account: account})
  }

  renderUserMenu() {
    if(this.state.user) {
      return (
        <UserMenu
          user={this.state.user}
          account={this.state.account}
          openPremiumSettings={() => {
            this.setState({modal: true})
            this.modalHooks.forEach(e => e && e.onOpen && e.onOpen())
          }}
        />
      )
    } else {
      return <LoginButton />
    }
  }

  render() {
    return (
      <>
        <Bar>
          <Container>
            <NavTitle>
              <NavLink nounderline="true" to="/">
                Mewna!<HiddenMobile style={{display: "inline-block"}}><small style={{fontSize: "0.4em"}}>alpha</small></HiddenMobile>
              </NavLink>
            </NavTitle>
            <FlexPadder />
            <HiddenMobile>
              <NavItem>
                <NavLink nounderline="true" to="/docs">
                  {$("en_US", "menu.docs")}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink nounderline="true" to="/premium">
                  {$("en_US", "menu.premium")}
                </NavLink>
              </NavItem>
              <NavItem>
                <ExternalLink nounderline="true" href="https://discord.gg/UwdDN6r" target="_blank" rel="noopener noreferrer">
                  {$("en_US", "menu.community")}
                </ExternalLink>
              </NavItem>
            </HiddenMobile>
            {this.renderUserMenu()}
          </Container>
        </Bar>
        <PremiumSettings
          show={this.state.modal}
          closeModal={() => this.setState({modal: false})}
          addHook={h => this.addModalHook(h)}
          removeHook={h => this.removeModalHook(h)}
        />
      </>
    )
  }
}
