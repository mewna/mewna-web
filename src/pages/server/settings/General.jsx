import React, { Component } from "react"
import ServerPage from "../ServerPage"
import GridContainer, { TwoColGrid, InterGridSpacer } from "../../../comp/GridContainer"
import { PaddedCard, InternalWidthFixer } from "../../../comp/Card"
import DebouncedTextarea from "../../../comp/DebouncedTextarea"
import DebouncedTextbox from "../../../comp/DebouncedTextbox"
import Switch from "../../../comp/Switch"
import Select from "../../../comp/Select"
import { success, toggleState } from "../../../Utils"
import $ from "../../../Translate"
import { withToastManager } from "react-toast-notifications"
import Formats from "./Formats"

export default withToastManager(class extends Component {
  state = {
    joinRole: this.props.config.welcoming.joinRoleId,
    messageChannel: this.props.config.welcoming.messageChannel,
  }

  render() {
    const everyone = this.props.cache.roles
      .filter(e => e.name === "@everyone")
      .map(e => ({value: e.id, label: e.name}))[0]
    const roleOptions = this.props.cache.roles.map(e => ({value: e.id, label: e.name}))
      .filter(e => e.label !== "@everyone")
      .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0))
    roleOptions.unshift(everyone)
    const channelOptions = this.props.cache.channels.map(e => ({value: e.id, label: "#" + e.name}))
      .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0))
    return (
      <>
        <GridContainer>
          <TwoColGrid>
            <PaddedCard>
              <h4>Prefix</h4>
              <p>{$("en_US", "settings.desc.general.prefix")}</p>
              <InternalWidthFixer>
                <DebouncedTextbox
                  maxLength={16}
                  value={this.props.config.behaviour.prefix}
                  placeholder="Default: mew."
                  callback={target => {
                    const prefix = target.value || "mew."
                    if (prefix != this.props.config.behaviour.prefix) {
                      const old = this.props.config.behaviour.prefix
                      let config = Object.assign({}, this.props.config)
                      config.behaviour.prefix = prefix
                      this.props.updateConfig(config, () => {
                        success(
                          this,
                          $("en_US", "settings.updates.change")
                            .replace("$setting", "Prefix")
                            .replace("$old", old || "mew.")
                            .replace("$new", prefix || "mew.")
                        )
                      })
                    }
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Join role</h4>
              <p>{$("en_US", "settings.desc.general.join-role")}</p>
              <InternalWidthFixer>
                <Select 
                  isSearchable={false}
                  options={roleOptions}
                  classname="Select-container"
                  classNamePrefix="Select"
                  onChange={(option, actionObj) => {
                    const { action } = actionObj
                    const { label, value } = option
                    const oldRole = this.state.joinRole
                    const newRole = label === "@everyone" ? null : value
                    this.setState({joinRole: newRole})
                    if (value != this.props.config.welcoming.joinRoleId) {
                      let config = Object.assign({}, this.props.config)
                      config.welcoming.joinRoleId = newRole
                      this.props.updateConfig(config, () => {
                        const oldName = oldRole ? this.props.cache.roles.filter(e => e.id === oldRole)[0].name : $("en_US", "settings.desc.none")
                        const newName = newRole ? this.props.cache.roles.filter(e => e.id === newRole)[0].name : $("en_US", "settings.desc.none")
                        success(
                          this,
                          $("en_US", "settings.updates.change")
                            .replace("$setting", "Join role")
                            .replace("$old", oldName)
                            .replace("$new", newName)
                        )
                      })
                    }
                  }}
                  value={roleOptions.filter(e => e.value === this.state.joinRole)}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Enable Join Messages</h4>
              <InternalWidthFixer>
                <Switch
                  checked={this.props.config.welcoming.enableWelcomeMessages}
                  callback={state => {
                    let config = Object.assign({}, this.props.config)
                    config.welcoming.enableWelcomeMessages = state
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", "Join messages")
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Enable Leave Messages</h4>
              <InternalWidthFixer>
                <Switch
                  checked={this.props.config.welcoming.enableGoodbyeMessages}
                  callback={state => {
                    let config = Object.assign({}, this.props.config)
                    config.welcoming.enableGoodbyeMessages = state
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", "Leave messages")
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Join / leave message channel</h4>
              <InternalWidthFixer>
                <Select
                  isSearchable={false}
                  options={channelOptions}
                  classname="Select-container"
                  classNamePrefix="Select"
                  onChange={(option, actionObj) => {
                    const { label, value } = option
                    const oldChannel = this.state.messageChannel
                    const newChannel = value
                    this.setState({messageChannel: newChannel})
                    if (newChannel != this.props.config.welcoming.messageChannel) {
                      let config = Object.assign({}, this.props.config)
                      config.welcoming.messageChannel = newChannel
                      this.props.updateConfig(config, () => {
                        const oldName = oldChannel ? "#" + this.props.cache.channels.filter(e => e.id === oldChannel)[0].name : $("en_US", "settings.desc.none")
                        const newName = newChannel ? "#" + this.props.cache.channels.filter(e => e.id === newChannel)[0].name : $("en_US", "settings.desc.none")
                        success(
                          this,
                          $("en_US", "settings.updates.change")
                            .replace("$setting", "Join/leave message channel")
                            .replace("$old", oldName)
                            .replace("$new", newName)
                        )
                      })
                    }
                  }}
                  value={channelOptions.filter(e => e.value === this.state.messageChannel)}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Join message</h4>
              <Formats />
              <InternalWidthFixer>
                <DebouncedTextarea
                  rows={8}
                  minrows={8}
                  maxrows={8}
                  value={this.props.config.welcoming.welcomeMessage || ""}
                  callback={target => {
                    const msg = target.value
                    if (msg != this.props.config.welcoming.welcomeMessage) {
                      let config = Object.assign({}, this.props.config)
                      config.welcoming.welcomeMessage = msg
                      this.props.updateConfig(config, () => {
                        success(
                          this,
                          $("en_US", "settings.updates.big-update")
                            .replace("$setting", "Join message")
                        )
                      })
                    }
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Leave message</h4>
              <Formats />
              <InternalWidthFixer>
                <DebouncedTextarea
                  rows={8}
                  minrows={8}
                  maxrows={8}
                  value={this.props.config.welcoming.goodbyeMessage || ""}
                  callback={target => {
                    const msg = target.value
                    if (msg != this.props.config.welcoming.goodbyeMessage) {
                      let config = Object.assign({}, this.props.config)
                      config.welcoming.goodbyeMessage = msg
                      this.props.updateConfig(config, () => {
                        success(
                          this,
                          $("en_US", "settings.updates.big-update")
                            .replace("$setting", "Leave message")
                        )
                      })
                    }
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
          </TwoColGrid>
        </GridContainer>
      </>
    )
  }
})
