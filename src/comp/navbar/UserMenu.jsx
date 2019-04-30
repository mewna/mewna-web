import React, { Component } from "react"
import styled from "@emotion/styled"
import onClickOutside from "react-click-outside"
import FlexPadder from "../FlexPadder"
import { NavMenuButton } from "./NavButton"
import store from "../../Storage"
import api from "../../Api"
import $ from "../../Translate"
import { HiddenDesktop } from "../HiddenDesktop"
import NavLink, { ExternalLink } from "../NavLink"

const Holder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  margin-left: 0.5em;
  margin-right: 0.5em;
  position: relative;
  cursor: pointer;
  user-select: none;
  background: ${props => props.expanded ? props.theme.colors.dark : props.theme.colors.med};
  border-radius: ${props => props.expanded ? "4px 4px 0 0" : 0};
  width: 10em;
  max-width: 10em;
  padding: 0.5em;
`
const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0px;
  background: ${props => props.theme.colors.dark};
  padding: 0.5em;
  /* This is really fucking stupid but it prevents overlaps */
  z-index: 10000;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  width: 10em;
  max-width: 10em;
`
const Avatar = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 0.25em;
`
const TextHolder = styled.div`
  max-width: calc(10em - 24px - 0.25em);
  text-overflow: ellipsis;
  overflow: hidden;
`
const Arrow = styled.div`
  border-left: ${props => props.expanded ? "5px" : "5px"} solid transparent;
  border-right: ${props => props.expanded ? "5px" : "5px"} solid transparent;
  border-top: ${props => props.expanded ? "none" : `5px solid ${props.theme.colors.text}`};
  border-bottom: ${props => props.expanded ? `5px solid ${props.theme.colors.text}` : "none"};
`

class UserMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  avatarExtension() {
    if(this.props.user.avatar && this.props.user.avatar.startsWith("a_")) {
      return "gif"
    } else {
      return "png"
    }
  }

  avatarUrl() {
    if(this.props.user.avatar) {
      return `https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.${this.avatarExtension()}`
    } else {
      return `https://cdn.discordapp.com/embed/avatars/${this.props.user.discriminator % 5}.png`
    }
  }
  
  handleClickOutside() {
    this.setState({expanded: false})
  }

  toggleTheme() {
    store.setLightTheme(!store.getLightTheme(), window.location.hostname)
  }

  logout() {
    api.logout(api.clientHostname())
    store.setToken(null, window.location.hostname)
  }

  renderMenu() {
    if(this.state.expanded) {
      return (
        <Menu>
          <NavMenuButton onClick={() => this.toggleTheme()} nounderline="true">
            {$("en_US", "menu.toggle-theme")}
          </NavMenuButton>
          <NavMenuButton>
              <NavLink nounderline="true" to={`/user/${this.props.user.id}`}>
                {$("en_US", "menu.my-profile")}
              </NavLink>
            </NavMenuButton>
          <HiddenDesktop style={{display: "flex", flexDirection: "column"}}>
            <NavMenuButton>
              <NavLink nounderline="true" to="/docs">
                {$("en_US", "menu.docs")}
              </NavLink>
            </NavMenuButton>
            <NavMenuButton>
              <NavLink nounderline="true" to="/">
              {$("en_US", "menu.premium")}
              </NavLink>
            </NavMenuButton>
            <NavMenuButton>
              <ExternalLink nounderline="true" href="https://discord.gg/UwdDN6r" target="_blank" rel="noopener noreferrer">
              {$("en_US", "menu.community")}
              </ExternalLink>
            </NavMenuButton>
          </HiddenDesktop>
          <NavMenuButton onClick={() => this.logout()} nounderline="true">Log out</NavMenuButton>
        </Menu>
      )
    } else {
      return ""
    }
  }

  render() {
    return (
      <Holder href="" onClick={e => {
        e.preventDefault()
        this.setState({expanded: !this.state.expanded})
      }} expanded={this.state.expanded}>
        <Avatar src={this.avatarUrl()} />
        <TextHolder>
          {this.props.user.username}
        </TextHolder>
        <FlexPadder />
        <Arrow expanded={this.state.expanded} />
        {this.renderMenu()}
      </Holder>
    )
  }
}

export default onClickOutside(UserMenu)