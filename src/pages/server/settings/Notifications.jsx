import React, { Component } from "react"
import GridContainer, { InterGridSpacer, TwoColGrid } from "../../../comp/GridContainer"
import { PaddedCard, InternalWidthFixer } from "../../../comp/Card"
import Switch from "../../../comp/Switch"
import FlexContainer, { DefaultFlexContainer } from "../../../comp/FlexContainer"
import FlexPadder from "../../../comp/FlexPadder"
import { PaddedButton } from "../../../comp/Button"
import $ from "../../../Translate"
import { backendUrl, twitchClientId } from "../../../Const"
import api from "../../../Api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DeleteButton from "../../../comp/DeleteButton"
import regeneratorRuntime from "regenerator-runtime"
import { success, toggleState } from "../../../Utils"
import { withToastManager } from 'react-toast-notifications'
import { AsyncSelect } from "../../../comp/Select"
import debounce from "debounce-promise"
import styled from "@emotion/styled"
import axios from "axios"
import { TwitchFormat } from "./Formats"
import DebouncedTextarea from "../../../comp/DebouncedTextarea"

export default withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.debouncedTwitchSearch = debounce(this.twitchSearch.bind(this), 500)
    this.state = {
      streamer: null,
      cache: {},
    }
  }

  createOAuthDialog(e) {
    e.preventDefault()
    if (typeof window !== undefined) {
      const hostname = window && window.location && window.location.hostname
      window.open(
        `${backendUrl(hostname)}/api/oauth/webhooks/start`,
        "Create a webhook",
        "resizable=no,menubar=no,scrollbars=yes,status=no,height=600,width=400"
      )
    }
  }

  render() {
    return (
      <>
        <GridContainer>
          <PaddedCard>
            <FlexContainer>
              <div>
                <h4>Webhooks</h4>
                {$("en_US", "settings.desc.notifications.webhooks")}
              </div>
              <FlexPadder />
              <PaddedButton onClick={e => this.createOAuthDialog(e)}>Add webhook</PaddedButton>
            </FlexContainer>
          </PaddedCard>
          {this.renderWebhooks()}
        </GridContainer>
        <InterGridSpacer />
        <GridContainer>
          <PaddedCard>
            <FlexContainer>
              <div>
                <h4>Twitch Streamers</h4>
                {$("en_US", "settings.desc.notifications.twitch")}
              </div>
              <FlexPadder />
              <AsyncSelect
                classname="Select-container"
                classNamePrefix="Select"
                loadOptions={async (str, arr) => {
                  return await this.debouncedTwitchSearch(str)
                }}
                value={this.state.streamer}
                onChange={(option, actionObj) => {
                  this.setState({streamer: option})
                }}
                components={{ Option: TwitchOption, SingleValue: TwitchSingleValue }}
              />
              <LeftPaddedButton onClick={e => this.createTwitchStreamer(e, this.state.streamer)}>Add streamer</LeftPaddedButton>
            </FlexContainer>
          </PaddedCard>
          {this.renderTwitchStreamers()}
        </GridContainer>
      </>
    )
  }

  createTwitchStreamer(e, streamer) {
    e.preventDefault()
    if(streamer) {
      const cache = this.state.cache
      cache[streamer.value] = streamer
      this.setState({streamer: null, cache: cache})
      const obj = new Streamer(streamer.value, true, null, true, null, false, null)
      const config = Object.assign({}, this.props.config)
      config.twitch.twitchStreamers.push(obj)
      this.props.updateConfig(config, () => {
        success(this, $("en_US", "settings.updates.added")
            .replace("$thing", streamer.label))
      })
    }
  }

  async twitchSearch(str) {
    const results = await axios.get(`https://api.twitch.tv/helix/users?login=${str}`, {
      headers: {
        "Client-ID": twitchClientId,
      }
    })
    return results.data.data.map(e => ({
      value: e.id,
      label: e.display_name,
      icon: e.profile_image_url,
      login: e.login,
    }))
  }

  renderTwitchStreamers() {
    const cards = []
    let key = 0
    this.props.config.twitch.twitchStreamers.filter(e => !this.state.cache[e.id])
      .forEach(async e => {
        const results = await axios.get(`https://api.twitch.tv/helix/users?id=${e.id}`, {
          headers: {
            "Client-ID": twitchClientId,
          }
        })
        const cache = this.state.cache
        cache[e.id] = results.data.data.map(e => ({
          value: e.id,
          label: e.display_name,
          icon: e.profile_image_url,
          login: e.login,
        }))[0]
        this.setState({cache: cache})
      })
    this.props.config.twitch.twitchStreamers.forEach(streamer => {
      if(this.state.cache[streamer.id]) {
        const cached = this.state.cache[streamer.id]
        cards.push(
          <PaddedCard key={key++}>
            <FlexContainer>
              <StreamerIcon src={cached.icon} />{cached.label}
              <FlexPadder />
              <DeleteButton onClick={e => {
                e.preventDefault()
                if(typeof window !== undefined) {
                  const config = Object.assign({}, this.props.config)
                  config.twitch.twitchStreamers = config.twitch.twitchStreamers.filter(e => e.id !== streamer.id)
                  this.props.updateConfig(config, () => {
                    success(this, $("en_US", "settings.updates.removed")
                        .replace("$thing", cached.label))
                  })
                }
              }}>
                <FontAwesomeIcon icon={"trash"} />
              </DeleteButton>
            </FlexContainer>
            <InterGridSpacer />
            <TwoColGrid>
              <FlexContainer>
                <h4>Enable stream end messages</h4>
                <FlexPadder />
                <Switch
                  checked={streamer.streamStartMessagesEnabled}
                  callback={state => {
                    const config = Object.assign({}, this.props.config)
                    const streamers = config.twitch.twitchStreamers.filter(e => e.id !== streamer.id)
                    const update = Object.assign({}, streamer)
                    update.streamStartMessagesEnabled = state
                    streamers.push(update)
                    config.twitch.twitchStreamers = streamers
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", `Stream start messages for ${cached.label}`)
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </FlexContainer>

              <FlexContainer>
                <h4>Enable stream end messages</h4>
                <FlexPadder />
                <Switch
                  checked={streamer.streamEndMessagesEnabled}
                  callback={state => {
                    const config = Object.assign({}, this.props.config)
                    const streamers = config.twitch.twitchStreamers.filter(e => e.id !== streamer.id)
                    const update = Object.assign({}, streamer)
                    update.streamEndMessagesEnabled = state
                    streamers.push(update)
                    config.twitch.twitchStreamers = streamers
                    this.props.updateConfig(config, () => {
                      success(this, $("en_US", "settings.updates.toggle")
                        .replace("$setting", `Stream end messages for ${cached.label}`)
                        .replace("$old", toggleState(state, true))
                        .replace("$new", toggleState(state, false)))
                    })
                  }}
                />
              </FlexContainer>

              <div>
                <h4>Stream start message</h4>
                <TwitchFormat start={true} />
                <InternalWidthFixer>
                  <DebouncedTextarea
                    rows={8}
                    minrows={8}
                    maxrows={8}
                    value={streamer.streamStartMessage || ""}
                    callback={target => {
                      const msg = target.value
                      const config = Object.assign({}, this.props.config)
                      const streamers = config.twitch.twitchStreamers.filter(e => e.id !== streamer.id)
                      const update = Object.assign({}, streamer)
                      update.streamStartMessage = msg
                      streamers.push(update)
                      config.twitch.twitchStreamers = streamers
                      this.props.updateConfig(config, () => {
                        success(this, $("en_US", "settings.updates.big-update")
                          .replace("$setting", `Stream start message for ${cached.label}`))
                      })
                    }}
                  />
                </InternalWidthFixer>
              </div>

              <div>
                <h4>Stream end message</h4>
                <TwitchFormat />
                <InternalWidthFixer>
                  <DebouncedTextarea
                    rows={8}
                    minrows={8}
                    maxrows={8}
                    value={streamer.streamEndMessage || ""}
                    callback={target => {
                      const msg = target.value
                      const config = Object.assign({}, this.props.config)
                      const streamers = config.twitch.twitchStreamers.filter(e => e.id !== streamer.id)
                      const update = Object.assign({}, streamer)
                      update.streamEndMessage = msg
                      streamers.push(update)
                      config.twitch.twitchStreamers = streamers
                      this.props.updateConfig(config, () => {
                        success(this, $("en_US", "settings.updates.big-update")
                          .replace("$setting", `Stream end message for ${cached.label}`))
                      })
                    }}
                  />
                </InternalWidthFixer>
              </div>
            </TwoColGrid>
          </PaddedCard>
        )
      } else {
        cards.push(
          <PaddedCard key={key++}>
            <FlexContainer>
              LOADING...
            </FlexContainer>
          </PaddedCard>
        )
      }
    })
    return cards
  }

  renderWebhooks() {
    const cards = []
    let key = 0
    this.props.cache.webhooks.forEach(webhook => {
      const channel = this.props.cache.channels.filter(e => e.id === webhook.channel)[0]
      const name = channel ? channel.name : $("en_US", "settings.desc.none")
      cards.push(
        <PaddedCard key={key++}>
          <FlexContainer>
            #{name}
            <FlexPadder />
            <DeleteButton onClick={async e => {
              e.preventDefault()
              if(typeof window !== undefined) {
                const host = api.clientHostname()
                await api.deleteGuildWebhook(host, this.props.cache.guild.id, webhook.id)
                await this.props.update()
                success(this, $("en_US", "settings.updates.removed")
                    .replace("$thing", "#" + name))
              }
            }}>
              <FontAwesomeIcon icon={"trash"} />
            </DeleteButton>
          </FlexContainer>
        </PaddedCard>
      )
    })
    return cards
  }
})

const LeftPaddedButton = styled(PaddedButton)`
  margin-left: 1em;
`

const TwitchOption = props => {
  const { innerRef, innerProps } = props
  const streamer = props.options[0]
  return (
    <DefaultFlexContainer ref={innerRef} {...innerProps}>
      <StreamerIcon src={streamer.icon} />{streamer.label}
    </DefaultFlexContainer>
  )
}
const TwitchSingleValue = props => {
  const { innerRef, innerProps } = props
  const streamer = props.data
  return (
    <DefaultFlexContainer ref={innerRef} {...innerProps}>
      <StreamerIcon src={streamer.icon} />{streamer.label}
    </DefaultFlexContainer>
  )
}

class Streamer {
  constructor(id, streamStartMessagesEnabled, streamStartMessage, streamEndMessagesEnabled,
      streamEndMessage, followMessagesEnabled, followMessage) {
      this.id = id
      this.streamStartMessagesEnabled = streamStartMessagesEnabled
      this.streamStartMessage = streamStartMessage || "{streamer.name} has started streaming! Check them out here: {link}"
      this.streamEndMessagesEnabled = streamEndMessagesEnabled
      this.streamEndMessage = streamEndMessage || "{streamer.name} has finished streaming."
      this.followMessagesEnabled = followMessagesEnabled
      this.followMessage = followMessage || "{follower.name} started following {streamer.name}!"
  }
}

const StreamerIcon = styled.img`
  border-radius: 50%;
  border: 2px solid white;
  width: 32px;
  height: 32px;
  margin-right: 0.5em;
  margin-left: 0.25em;
  box-sizing: border-box;
`