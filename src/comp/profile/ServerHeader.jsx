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
  ProfileNameWrapper,
  ProfileIcon
} from "./Header"
import Card from "../Card"
import { FlexPadderDesktop } from "../FlexPadder"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import store from "../../Storage"
import api from "../../Api"
import $ from "../../Translate"
import Button from "../Button"
import styled from "@emotion/styled"
import { css } from "@emotion/core"
import Modal from "@bdenzer/react-modal"
import { darkBackground, lightBackground, textColor } from "../Utils"
import lookupBackground, { defaultBackgrounds, premiumBackgrounds } from "../../Backgrounds"
import { ThreeColGrid } from "../GridContainer"

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

const MewnaModalWrapper = styled.div`
  & > #modal-modalBackground > #modal-modalInner > #modal-modalBody,
  & > #modal-modalBackground > #modal-modalInner > #modal-modalHeader {
    ${lightBackground}
  }

  & > #modal-modalBackground > #modal-modalInner > #modal-modalHeader {
    border-bottom: 1px solid ${props => props.theme.colors.med} !important;
  }

  & > #modal-modalBackground > #modal-modalInner > #modal-modalHeader > #modal-closeButton {
    color: ${props => props.theme.colors.text} !important;

    :hover {
      color: ${props => props.theme.colors.text} !important;
    }
  }
`

const BackgroundGrid = styled(ThreeColGrid)`
  grid-template-rows: 3em;
  grid-auto-rows: 3em;
`

const BackgroundCard = styled.div`
  border-radius: 4px;
  border: 2px solid ${props => props.theme.colors.text};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
`
const BackgroundUpload = styled(Button)`
  margin-top: 1em;
  width: 100%;
`

const PremiumWrapper = styled.div`
  margin-top: 1em;
  position: relative;
  width: 100%;
`
const PremiumText = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 4px;
  font-weight: bold;
  line-height: 1.5em;
`

class BackgroundModal extends Component {
  renderBackgrounds(bgs) {
    const cards = []
    let key = 0
    for(const bg in bgs) {
      cards.push(
        <div key={key++}>
          <BackgroundCard
            style={{background: `url("${bgs[bg]}") center / cover`}}
            onClick={e => {
              e.preventDefault()
              this.props.onClickBackground && this.props.onClickBackground(bg)
              this.props.closeModal()
            }}
          />
        </div>
      )
    }
    return cards
  }

  render() {
    return (
      <MewnaModalWrapper>
        <Modal
          shouldShowModal={this.props.show}
          closeModal={() => this.props.closeModal()}
          title={$("en_US", "profile.edit.background-modal")}
        >
          <BackgroundGrid>
            {this.renderBackgrounds(defaultBackgrounds)}
          </BackgroundGrid>
          <PremiumWrapper>
            <BackgroundGrid>
              {this.renderBackgrounds(premiumBackgrounds, true, this.props.info && this.props.info.premium)}
            </BackgroundGrid>
            <BackgroundUpload>
              {$("en_US", "profile.edit.background-upload")}
            </BackgroundUpload>
            <PremiumText>
              {$("en_US", "profile.edit.premium-backgrounds")}
              <Button>Upgrade</Button>
            </PremiumText>
          </PremiumWrapper>
        </Modal>
      </MewnaModalWrapper>
    )
  }
}

const OneButtonWrapper = styled.div`
  @media screen and (max-width: 768px) {
    margin-top: 0.5em;
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 0.5em;
  }
`
const TwoButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 0.5em;
  @media screen and (max-width: 768px) {
    margin-top: 0.5em;
  }
`

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      customBackground: this.props.customBackground,
      backgroundModal: false,
    }
  }

  componentDidMount() {
    this.props.editRegister(this)
  }
  
  componentWillUnmount() {
    this.props.editUnregister(this)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.customBackground && prevProps.customBackground !== this.props.customBackground) {
      this.setState({customBackground: this.props.customBackground})
    }
  }
  
  fetchEdits() {
    return {customBackground: this.state.customBackground}
  }

  resetEdits() {
    this.setState({customBackground: this.props.customBackground})
  }

  renderEditButton(route) {
    if(this.props.manages && route.match(/^\/server\/\d+\/?$/)) {
      if(this.state.editing) {
        return (
          <TwoButtonWrapper>
            <Button onClick={async () => {
              if(!this.props.editFinishClickCallback) {
                this.setState({editing: false})
                return
              }
              const worked = await this.props.editFinishClickCallback()
              if(worked) {
                this.setState({editing: false, customBackground: this.props.customBackground})
              }
            }}>Save</Button>
            <Button onClick={async () => {
              this.setState({editing: false}, () => {
                this.props.editCancelClickCallback && this.props.editCancelClickCallback()
              })
            }}>Cancel</Button>
          </TwoButtonWrapper>
        )
      } else {
        return (
          <OneButtonWrapper>
            <Button onClick={() => {
              this.setState({editing: true}, () => {
                this.props.editClickCallback && this.props.editClickCallback()
              })
            }}>Edit</Button>
          </OneButtonWrapper>
        )
      }
    } else {
      return ""
    }
  }

  renderBackground() {
    if(this.state.editing) {
      let bg = this.state.customBackground || this.props.customBackground
      if(typeof bg === "string" && bg.startsWith("/backgrounds/")) {
        bg = lookupBackground(bg)
      }
      return (
        <div style={{position: "relative"}}>
          <Header background={bg} style={{filter: "brightness(0.5)"}} />
          <BackgroundEditCover onClick={() => this.setState({backgroundModal: true})}>
            {$("en_US", "profile.edit.background")}
          </BackgroundEditCover>
        </div>
      )
    } else {
      return <Header background={this.props.customBackground} />
    }
  }

  render() {
    return (
      <HeaderContainer>
        <Card>
          {this.renderBackground()}
          <BackgroundModal
            show={this.state.backgroundModal}
            onClickBackground={bg => this.setState({customBackground: bg})}
            closeModal={() => this.setState({backgroundModal: false})}
          />
          <TabsBar>
            <ProfileIcon src={this.props.serverIcon} alt="server icon" />
            <ProfileNameWrapper>
              <ProfileName>
                {this.props.serverName}
              </ProfileName>
              {this.renderEditButton(this.props.currentPath)}
            </ProfileNameWrapper>
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

const BackgroundEditCover = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
  @media screen and (min-width: 769px) {
    align-items: center;
    align-content: center;
  }
  @media screen and (max-width: 768px) {
    padding-top: 2em;
  }
`
