import React, { Component } from "react"
import GridContainer, {
  TwoColGrid,
  InterGridSpacer
} from "../../../comp/GridContainer"
import { PaddedCard, InternalWidthFixer } from "../../../comp/Card"
import DebouncedTextarea from "../../../comp/DebouncedTextarea"
import FlexContainer from "../../../comp/FlexContainer"
import Switch from "../../../comp/Switch"
import PaddedButton from "../../../comp/Button"
import Select from "../../../comp/Select"
import FlexPadder from "../../../comp/FlexPadder"
import { withToastManager } from 'react-toast-notifications'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import $ from "../../../Translate"
import { toggleState, success } from "../../../Utils"
import { LevelsFormat } from "./Formats"
import DeleteButton from "../../../comp/DeleteButton"

const numberOptions = []
for(let i = 1; i <= 100; i++) {
  numberOptions.push({value: i, label: `${$("en_US", "settings.desc.levels.level")} ${i}`})
}

export default withToastManager(class extends Component {
  render() {
    //const everyone = this.props.cache.roles
    //  .filter(e => e.name === "@everyone")
    //  .map(e => ({value: e.id, label: e.name}))[0]
    const roleOptions = this.props.cache.roles.map(e => ({value: e.id, label: e.name}))
      .filter(e => e.label !== "@everyone")
      .sort((a, b) => (a.label.toLowerCase() > b.label.toLowerCase()) ? 1 : ((b.label.toLowerCase() > a.label.toLowerCase()) ? -1 : 0))
    // roleOptions.unshift(everyone)
    // console.log(roleOptions)

    return (
      <>
        <GridContainer>
          <TwoColGrid>
            <PaddedCard>
              <h4>Enable levels</h4>
              <InternalWidthFixer>
                <Switch
                  checked={this.props.config.levels.levelsEnabled}
                  callback={state => {
                    let config = Object.assign({}, this.props.config)
                    config.levels.levelsEnabled = state
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", "Enable levels")
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Enable level-up messages</h4>
              <InternalWidthFixer>
                <Switch
                  checked={this.props.config.levels.levelUpMessagesEnabled}
                  callback={state => {
                    let config = Object.assign({}, this.props.config)
                    config.levels.levelUpMessagesEnabled = state
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", "Enable level-up messages")
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Remove previous role rewards</h4>
              <p>
                If enabled, users will only have the highest role reward.
                Otherwise, they can have multiple role rewards.
              </p>
              <InternalWidthFixer>
                <Switch
                  checked={this.props.config.levels.removePreviousRoleRewards}
                  callback={state => {
                    let config = Object.assign({}, this.props.config)
                    config.levels.removePreviousRoleRewards = state
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", "Remove previous role rewards")
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
            <PaddedCard>
              <h4>Import MEE6 levels</h4>
              <p>
                {$("en_US", "settings.desc.levels.mee6-import.1")}
              </p>
              <p>
                {$("en_US", "settings.desc.levels.mee6-import.2")}
              </p>
              <InternalWidthFixer>
                <PaddedButton>Import</PaddedButton>
              </InternalWidthFixer>
            </PaddedCard>
          </TwoColGrid>
        </GridContainer>
        <InterGridSpacer />
        <GridContainer>
          <PaddedCard>
            <h4>Level-up message</h4>
            <LevelsFormat />
            <DebouncedTextarea
              rows={8}
              minrows={8}
              maxrows={8}
              value={this.props.config.levels.levelUpMessage || ""}
              callback={target => {
                const msg = target.value
                if (msg != this.props.config.levels.levelUpMessage) {
                  let config = Object.assign({}, this.props.config)
                  config.levels.levelUpMessage = msg
                  this.props.updateConfig(config, () => {
                    success(
                      this,
                      $("en_US", "settings.updates.big-update")
                        .replace("$setting", "Level-up message")
                    )
                  })
                }
              }}
            />
          </PaddedCard>
        </GridContainer>
        <InterGridSpacer />
        <GridContainer>
          <PaddedCard>
            <FlexContainer>
              <div>
                <h4>Role rewards</h4>
                {$("en_US", "settings.desc.levels.role-chooser")}
              </div>
              <FlexPadder />
              <Select 
                options={roleOptions}
                isSearchable={false}
                classname="Select-container"
                classNamePrefix="Select"
                onChange={(option, actionObj) => {
                  const { label, value } = option
                  if (!this.props.config.levels.levelRoleRewards[value]) {
                    let config = Object.assign({}, this.props.config)
                    config.levels.levelRoleRewards[value] = 1
                    this.props.updateConfig(config, () => {
                      success(
                        this,
                        $("en_US", "settings.updates.added")
                          .replace("$thing", label)
                      )
                    })
                  }
                }}
                value={null}
              />
            </FlexContainer>
          </PaddedCard>
          {this.renderRoleRewards()}
        </GridContainer>
        <InterGridSpacer />
        <GridContainer>
          {this.props.renderCommands("levels")}
        </GridContainer>
      </>
    )
  }

  renderRoleRewards() {
    const cards = []
    let key = 0
    const rewards = this.props.config.levels.levelRoleRewards
    for(const id in rewards) {
      const level = rewards[id]
      const role = this.props.cache.roles.filter(e => e.id === id)[0]
      const roleName = role ? role.name : "Unknown role"
      cards.push(
        <PaddedCard key={key++}>
          <FlexContainer>
            <div>{roleName}</div>
            <FlexPadder />
            <Select
              options={numberOptions}
              classname="Select-container"
              classNamePrefix="Select"
              onChange={(option, actionObj) => {
                const { label, value } = option
                if (!this.props.config.levels.levelRoleRewards[value]) {
                  let config = Object.assign({}, this.props.config)
                  config.levels.levelRoleRewards[id] = value
                  this.props.updateConfig(config, () => {
                    success(this, $("en_US", "settings.updates.change")
                        .replace("$setting", roleName)
                        .replace("$old", level)
                        .replace("$new", value)
                    )
                  })
                }
              }}
              value={numberOptions.filter(e => e.value === level)[0]}
            />
            <DeleteButton onClick={e => {
              e.preventDefault()
              if (this.props.config.levels.levelRoleRewards[id]) {
                let config = Object.assign({}, this.props.config)
                delete config.levels.levelRoleRewards[id]
                this.props.updateConfig(config, () => {
                  success(this, $("en_US", "settings.updates.removed")
                      .replace("$thing", roleName)
                  )
                })
              }
            }}>
              <FontAwesomeIcon icon={"trash"} />
            </DeleteButton>
          </FlexContainer>
        </PaddedCard>
      )
    }
    return cards
  }
})

