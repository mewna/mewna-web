import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import styled from "@emotion/styled"
import Modal from "@bdenzer/react-modal"

import {
  Header,
  renderTab,
  HeaderContainer,
  TabsBar,
  ProfileName,
  ProfileNameWrapper,
  ProfileIcon
} from "./Header"
import Card from "../Card"
import Button from "../Button"
import api from "../../Api"
import lookupBackground, { defaultBackgrounds, premiumBackgrounds } from "../../Backgrounds"
import { ThreeColGrid } from "../GridContainer"
import $ from "../../Translate"
import { lightBackground } from "../Utils"
import DebouncedTextbox from "../DebouncedTextbox"
import mewna from "../../assets/mewna-avatar.png"

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

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      customBackground: this.props.customBackground,
      backgroundModal: false,
      displayName: this.props.displayName,
    }
  }

  componentDidMount() {
    this.props.editRegister(this)
  }
  
  componentWillUnmount() {
    this.props.editUnregister(this)
  }

  componentDidUpdate(prevProps) {
    if(this.props.customBackground && prevProps.customBackground !== this.props.customBackground) {
      this.setState({customBackground: this.props.customBackground})
    }
    if(this.props.displayName && prevProps.displayName !== this.props.displayName) {
      this.setState({displayName: this.props.displayName})
    }
  }
  
  fetchEdits() {
    return {customBackground: this.state.customBackground, displayName: this.state.displayName}
  }

  resetEdits() {
    this.setState({customBackground: this.props.customBackground, displayName: this.props.displayName})
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

  renderEditButton() {
    // stupid hack because APPARENTLY atob doesn't exist on the server.........
    if(typeof window !== "undefined" && this.props.userId === api.userId()) {
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

  renderName() {
    if(this.state.editing) {
      return (
        <DebouncedTextbox
          value={this.state.displayName}
          debounce={10}
          style={{marginRight: "0.5em"}}
          maxLength={32}
          callback={e => {
            this.setState({displayName: e.value})
          }}
        />
      )
    } else {
      return (
        <ProfileName>
          {this.props.displayName || "Unknown user"}
        </ProfileName>
      )
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
            <ProfileIcon src={this.props.avatar || mewna} alt="avatar" />
            <ProfileNameWrapper>
              {this.renderName()}
              {this.renderEditButton()}
            </ProfileNameWrapper>
            {renderTab(
              "Timeline",
              "newspaper",
              `/user/${this.props.userId}`,
              this.props.currentPath
            )}
            {(typeof window !== "undefined" && this.props.userId === api.userId()) ? renderTab(
              "Premium",
              "medal",
              "/premium",
              this.props.currentPath,
              {color: "gold"}
            ) : ""}
          </TabsBar>
        </Card>
      </HeaderContainer>
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
