import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import {
  Header,
  Tab,
  SelectedTab,
  HiddenTabText,
  HeaderContainer,
  TabsBar,
  ProfileName,
  ProfileIcon
} from "./Header"
import Card from "../Card"
import { FlexPadderDesktop } from "../FlexPadder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import store from "../../Storage"
import api from "../../Api"
import $ from "../../Translate"

export const renderTab = (title, icon, route, currentPath) => {
  let TabComp
  if (route.match(/^\/server\/\d+\/?$/)) {
    TabComp = currentPath === route ? SelectedTab : Tab
  } else {
    TabComp = currentPath.startsWith(route) ? SelectedTab : Tab
  }
  return (
    <TabComp to={route} nounderline="true">
      <HiddenTabText>{title}</HiddenTabText> <FontAwesomeIcon icon={icon} />
    </TabComp>
  )
}

const renderSettingsTab = (manages, serverId, currentPath) => {
  if(manages) {
    return (
      <>
        <FlexPadderDesktop />
        {renderTab(
          "Settings",
          "cogs",
          `/server/${serverId}/edit`,
          currentPath
        )}
      </>
    )
  } else {
    return ""
  }
}

export default class extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <HeaderContainer>
        <Card>
          <Header background={this.props.backgroundImage} />
          <TabsBar>
            <ProfileIcon src={this.props.serverIcon} alt="server icon" />
            <ProfileName>{this.props.serverName}</ProfileName>
            {renderTab(
              "Timeline",
              "newspaper",
              `/server/${this.props.serverId}`,
              this.props.currentPath
            )}
            {/*renderTab("About", "user", `/server/${this.props.serverId}/about`, this.props.currentPath)*/}
            {renderTab(
              "Leaderboard",
              "trophy",
              `/server/${this.props.serverId}/leaderboard`,
              this.props.currentPath
            )}
            {renderSettingsTab(this.props.manages, this.props.serverId, this.props.currentPath)}
          </TabsBar>
        </Card>
      </HeaderContainer>
    )
  }
}
