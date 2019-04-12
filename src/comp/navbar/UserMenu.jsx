import React, { Component } from "react"
import styled from "@emotion/styled"
import onClickOutside from "react-click-outside"
import FlexPadder from "../FlexPadder"
import { NavMenuButton } from "./NavButton"
import store from "../../Storage"
import api from "../../Api"

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
  
  handleClickOutside() {
    this.setState({expanded: false})
  }

  toggleTheme() {
    store.setLightTheme(!store.getLightTheme())
  }

  logout() {
    api.logout(api.clientHostname())
    store.setToken(null)
  }

  renderMenu() {
    if(this.state.expanded) {
      return (
        <Menu>
          <NavMenuButton onClick={() => this.toggleTheme()} nounderline="true">Change theme</NavMenuButton>
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
        <Avatar src={`https://cdn.discordapp.com/avatars/${this.props.user.id}/${this.props.user.avatar}.${this.avatarExtension()}`} />
        {this.props.user.username}
        <FlexPadder />
        <Arrow expanded={this.state.expanded} />
        {this.renderMenu()}
      </Holder>
    )
  }
}

export default onClickOutside(UserMenu)