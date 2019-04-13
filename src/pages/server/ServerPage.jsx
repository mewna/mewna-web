import React, { Component } from "react"
import { Helmet } from "react-helmet"

import regeneratorRuntime from "regenerator-runtime"

import background from "../../assets/backgrounds/default/plasma.png"
import mewna from "../../assets/mewna-avatar.png"

import Container from "../../comp/Container"
import FlexPadder from "../../comp/FlexPadder"
import Switch from "../../comp/Switch"
import { PaddedCard } from "../../comp/Card"
import ServerHeader from "../../comp/profile/ServerHeader"
import store from "../../Storage"
import api from "../../Api"
import { toggleState, success, error } from "../../Utils"
import $ from "../../Translate"
import { withToastManager } from 'react-toast-notifications';

import ServerTimeline from "./ServerTimeline"
import ServerSettings from "./ServerSettings"
import ServerLeaderboard from "./ServerLeaderboard"

import General from "./settings/General"
import Economy from "./settings/Economy"
import Levels from "./settings/Levels"
import Music from "./settings/Music"
import Notifications from "./settings/Notifications"
import Misc from "./settings/Misc"

import styled from "@emotion/styled"

export default withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      manages: false,
      config: {},
      leaderboard: [],
      rewards: [],
      prefix: "mew.",
      cache: {
        guild: {},
        channels: [],
        roles: [],
        webhooks: [],
      },
    }
  }

  async handleRefreshMessage(e) {
    if (e.data.reload) {
      await this.updateRender()
    }
  }

  async updateRender() {
    if(typeof window !== undefined) {
      const host = api.clientHostname()
      const id = this.props.match.params.id
      const manages = await api.manages(host, id)
      const config = manages ? await api.guildConfig(host, id) : {}
      const leaderboard = await api.guildLeaderboard(host, id)
      const rewards = await api.guildRewards(host, id)
      const prefix = await api.guildPrefix(host, id).prefix || "mew."
      const guild = await api.cachedGuild(host, id)
      const channels = await api.cachedChannels(host, id)
      const roles = await api.cachedRoles(host, id)
      const webhooks = manages ? await api.guildWebhooks(host, id) : []
      this.setState({
        manages: manages,
        config: config,
        leaderboard: leaderboard,
        rewards: rewards,
        prefix: prefix,
        cache: {
          guild: guild,
          channels: channels,
          roles: roles,
          webhooks: webhooks,
        },
      })
    }
  }

  async updateConfig(data, callback) {
    if(typeof window !== undefined) {
      const host = api.clientHostname()
      const response = await api.updateGuildConfig(host, this.props.match.params.id, this.state.config)
      const rewards = await api.guildRewards(host, this.props.match.params.id)
      if(response.errors) {
        error(this, $("en_US", "settings.updates.invalid"))
      } else {
        this.setState({config: data, rewards: rewards}, async () => callback())
      }
    }
  }

  async componentDidMount() {
    store.register(this)
    await this.updateRender()
    if (typeof window !== undefined) {
      window.addEventListener("message", this.handleRefreshMessage.bind(this))
    }
  }

  componentWillUnmount() {
    store.unregister(this)
    if (typeof window !== undefined) {
      window.removeEventListener("message", this.handleRefreshMessage.bind(this))
    }
  }

  chooseSubpage() {
    if(!this.props.match.params.key) {
      // No subkey, render timeline
      return <ServerTimeline />
    } else if(this.props.match.params.key === "leaderboard") {
      // Render leaderboards
      return <ServerLeaderboard
          match={this.props.match}
          leaderboard={this.state.leaderboard}
          rewards={this.state.rewards}
          prefix={this.state.prefix}
        />
    } else if(this.props.match.params.key === "edit") {
      if(this.state.manages) {
        // Render settings pages
        if(!this.props.match.params.subkey) {
          // Render base page
          return <ServerSettings match={this.props.match} />
        } else {
          switch(this.props.match.params.subkey) {
            case "general":
              return <General config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
            case "economy":
              return <Economy config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
            case "levels":
              return <Levels config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
            case "music":
              return <Music config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
            case "notifications":
              return <Notifications config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
            case "miscellaneous":
              return <Misc config={this.state.config}
                updateConfig={(data, callback) => this.updateConfig(data, callback)}
                renderCommands={section => this.renderCommands(section)}
                renderCommandsHeader={() => this.renderCommandsHeader()}
                cache={this.state.cache}
                update={async () => this.updateRender()}
              />
          }
        }
      } else {
        return (
          <h3>You're not allowed to do that!</h3>
        )
      }
    } else {
      // Render a timeline post
      return "TODO"
    }
  }

  render() {
    return (
      <Container>
        <Helmet>
          <title>Mewna :: Mewna Comewnaty</title>
        </Helmet>
        <ServerHeader
            serverId={this.props.match.params.id}
            serverName={this.state.cache.guild.name || "Unknown server"}
            serverIcon={this.state.cache.guild.icon || mewna}
            backgroundImage={background}
            currentPath={this.props.location.pathname}
            manages={this.state.manages}
          />
        {this.chooseSubpage()}
      </Container>
    )
  }

  renderCommandsHeader() {
    return (
      <div>
        <h3>Commands</h3>
      </div>
    )
  }

  renderCommands(section) {
    const cards = []
    const settings = this.state.config[section].commandSettings
    let rkey = 0
    const prefix = this.state.config.behaviour.prefix || "mew."
    for(const key in settings) {
      cards.push(
      <CommandCard key={rkey++}>
        <h4>{prefix}{key}</h4>
        <FlexPadder />
        <Switch
          checked={this.state.config[section].commandSettings[key].enabled}
          callback={state => {
            let config = Object.assign({}, this.state.config)
            config[section].commandSettings[key].enabled = state
            this.updateConfig(config, () => {
              success(this, $("en_US", "settings.updates.toggle")
                .replace("$setting", `${prefix}${key}`)
                .replace("$old", toggleState(state, true))
                .replace("$new", toggleState(state, false)))
            })
          }}
        />
      </CommandCard>
      )
    }
    return cards
  }
})

const CommandCard = styled(PaddedCard)`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
`
