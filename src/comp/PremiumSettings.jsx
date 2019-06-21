import React, { Component } from "react"
import styled from "@emotion/styled"
import Modal from "@bdenzer/react-modal"
import { lightBackground } from "./Utils"
import api from "../Api"
import { LoadingSmall } from "./Loading"
import Textbox from "./Textbox"
import Button from "./Button";
import $ from "../Translate"

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

  & > #modal-modalBackground > #modal-modalInner {
    min-height: initial !important;
  }
`

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: {},
      nextPrefix: "",
    }
  }

  async onOpen() {
    const settings = await api.getPremiumSettings(api.clientHostname())
    this.setState({settings: settings})
  }

  componentDidMount() {
    this.props.addHook(this)
  }

  componentWillUnmount() {
    this.props.removeHook(this)
  }

  render() {
    return (
      <MewnaModalWrapper>
        <Modal
          shouldShowModal={this.props.show}
          closeModal={() => this.props.closeModal()}
          title={"premium settingsssssssssssss"}
        >
          modal?<br />
          <img src="https://cdn.discordapp.com/emojis/399914557893509121.png?v=1" />
          <hr />
          <h3>Personal prefixes</h3>
          <div>{$("en_US", "premium.user.personal-prefixes.1")}</div>
          <div>{$("en_US", "premium.user.personal-prefixes.2")}</div>
          <div style={{marginTop: "0.5em"}}>
            {this.renderPrefixes()}
          </div>
          <hr />
          <h3>Uploaded background image</h3>
          {this.renderCustomBackground()}
        </Modal>
      </MewnaModalWrapper>
    )
  }

  renderPrefixes() {
    if(this.state.settings && this.state.settings.personalPrefixes) {
      const prefixes = this.state.settings.personalPrefixes
      let cards = []
      if(prefixes.length > 0) {
        cards.push(
          <div key="a">Your prefixes: {JSON.stringify(prefixes)}</div>
        )
      } else {
        cards.push(
          <div key="a">You have no prefixes :(</div>
        )
      }
      return (
        <>
          <div style={{marginBottom: "0.5em"}}>
            {cards}
          </div>
          <div style={{display: "flex"}}>
            <Textbox
              maxLength={16}
              value={this.state.nextPrefix}
              placeholder="Default: mew."
              onChange={e => {
                e.preventDefault()
                this.setState({nextPrefix: e.target.value})
              }}
              len={10}
            />
            <Button style={{marginLeft: "0.5em"}} onClick={e => {
              e.preventDefault()
              if(this.state.nextPrefix !== "") {
                prefixes.push(this.state.nextPrefix)
                const settings = Object.assign({}, this.state.settings)
                settings.personalPrefixes = prefixes
                this.setState({settings: settings, nextPrefix: ""}, () => e.value = "")
              }
            }}>Add</Button>
          </div>
        </>
      )
    } else {
      return <LoadingSmall />
    }
  }


  renderCustomBackground() {
    if(this.state.settings && this.state.settings.uploadedBackground !== undefined) {
      const bg = this.state.settings.uploadedBackground
      if(bg) {
        return `Your bg: ${bg}`
      } else {
        return "You haven't uploaded a bg yet :("
      }
    } else {
      return <LoadingSmall />
    }
  }
}