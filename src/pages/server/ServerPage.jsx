import React, { Component } from "react"
import { Helmet } from "react-helmet"
import { matchPath } from "react-router"
import regeneratorRuntime from "regenerator-runtime"

import mewna from "../../assets/mewna-avatar.png"

import Container from "../../comp/Container"
import FlexPadder from "../../comp/FlexPadder"
import Switch from "../../comp/Switch"
import { PaddedCard } from "../../comp/Card"
import ServerHeader from "../../comp/profile/ServerHeader"
import store from "../../Storage"
import api from "../../Api"
import { toggleState, success, error } from "../../Utils"
import { withToastManager } from 'react-toast-notifications'
import $ from "../../Translate"
import backgroundLookup from "../../Backgrounds"
import Loading from "../../comp/Loading"

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

const ServerPageInternal = withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.editRegistry = []
    if(props.cache) {
      this.state = {
        editing: false,
        manages: this.props.manages,
        config: this.props.config,
        leaderboard: this.props.leaderboard,
        rewards: this.props.rewards,
        prefix: this.props.prefix,
        info: this.props.info,
        currentPost: this.props.currentPost,
        currentPostAuthor: this.props.currentPostAuthor,
        posts: this.props.posts,
        authors: this.props.authors,
        cache: {
          guild: this.props.cache.guild,
          channels: this.props.cache.channels,
          roles: this.props.cache.roles,
          webhooks: this.props.cache.webhooks,
        },
      }
    } else {
      this.state = {
        editing: false,
        manages: false,
        config: {},
        leaderboard: [],
        rewards: [],
        prefix: "mew.",
        info: {},
        currentPost: null,
        currentPostAuthor: null,
        posts: [],
        authors: [],
        cache: {
          guild: {},
          channels: {},
          roles: {},
          webhooks: {},
        },
      }
    }
  }

  editRegister(e) {
    this.editRegistry.push(e)
  }

  editUnregister(e) {
    this.editRegistry = this.editRegistry.filter(x => x !== e)
  }

  async handleRefreshMessage(e) {
    if (e.data.reload) {
      await this.updateRender()
    }
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.match.params.key !== this.props.match.params.key) {
      if(
        // Previous props had a post and current one does not
        (prevProps.match.params.key && /\d+/.test(prevProps.match.params.key) && !this.props.match.params.key)
        ||
        // Current props had a post and previous one does not
        (this.props.match.params.key && /\d+/.test(this.props.match.params.key) && !prevProps.match.params.key)
      ) {
        await this.updateRender()
      }
    }
  }

  async updateRender() {
    if(typeof window !== undefined) {
      const host = api.clientHostname()
      const id = this.props.match.params.id
      const post = this.props.match.params.key
      const newState = await this.props.fetchData(host, id, post)
      this.setState(newState)
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
    if(!this.props.match.params.key || /\d+/.test(this.props.match.params.key)) {
      // No subkey, render timeline
      return <ServerTimeline
        manages={this.state.manages}
        info={this.state.info}
        cache={this.state.cache}
        editing={this.state.editing}
        editRegister={e => this.editRegister(e)}
        editUnregister={e => this.editUnregister(e)}
        posts={this.state.posts}
        authors={this.state.authors}
        currentPost={this.state.currentPost}
        currentPostAuthor={this.state.currentPostAuthor}
        postId={this.props.match.params.key}
        updateRender={() => this.updateRender()}
      />
    } else if(this.props.match.params.key === "leaderboard") {
      // Render leaderboards
      return <ServerLeaderboard
          match={this.props.match}
          leaderboard={this.state.leaderboard}
          rewards={this.state.rewards}
          prefix={this.state.prefix}
          cache={this.state.cache}
        />
    } else if(this.props.match.params.key === "edit") {
      if(this.state.manages) {
        // Render settings pages
        if(!this.props.match.params.subkey) {
          // Render base page
          return <ServerSettings match={this.props.match} />
        } else {
          const pageProps = {
            config: this.state.config,
            updateConfig: (data, callback) => this.updateConfig(data, callback),
            renderCommands: section => this.renderCommands(section),
            renderCommandsHeader: () => this.renderCommandsHeader(),
            cache: this.state.cache,
            update: async () => this.updateRender(),
          }
          switch(this.props.match.params.subkey) {
            case "general":
              return <General {...pageProps} />
            case "economy":
              return <Economy {...pageProps} />
            case "levels":
              return <Levels {...pageProps} />
            case "music":
              return <Music {...pageProps} />
            case "notifications":
              return <Notifications {...pageProps} />
            case "miscellaneous":
              return <Misc {...pageProps} />
          }
        }
      } else {
        return (
          <h3>You're not allowed to do that!</h3>
        )
      }
    } else {
      // TODO: Redirect to /
      return "TODO"
    }
  }

  render() {
    if(!this.state.cache.guild.id) {
      return (
        <Loading />
      )
    }
    return (
      <Container>
        <Helmet>
          <title>Mewna :: {this.state.cache.guild.name || "Unknown server"}'s page</title>
        </Helmet>
        <ServerHeader
          serverId={this.props.match.params.id}
          serverName={this.state.cache.guild.name || "Unknown server"}
          serverIcon={this.state.cache.guild.icon || mewna}
          info={this.state.info}
          customBackground={backgroundLookup(this.state.info.customBackground || "/backgrounds/default/plasma")}
          currentPath={this.props.location.pathname}
          manages={this.state.manages}
          editRegister={e => this.editRegister(e)}
          editUnregister={e => this.editUnregister(e)}
          editClickCallback={() => {
            this.setState({editing: true})
          }}
          editCancelClickCallback={() => {
            this.editRegistry.map(e => e.resetEdits())
            this.setState({editing: false})
          }}
          editFinishClickCallback={async () => {
            const changes = this.editRegistry.map(e => e.fetchEdits()).reduce(((r, c) => Object.assign(r, c)), {})
            const info = Object.assign(Object.assign({}, this.state.info), changes)
            const host = api.clientHostname()
            const id = this.props.match.params.id
            const result = await api.updateGuildInfo(host, id, info)
            if(result["errors"]) {
              error(this, $("en_US", "profile.edit.bad-config"))
              return false
            } else {
              this.setState({editing: false}, async () => {
                await this.updateRender()
                success(this, $("en_US", "profile.edit.saved"))
              })
              return true
            }
          }}
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

export default class ServerPage extends Component {
  static async getInitialProps(ctx) {
    const { req } = ctx
    const match = ServerPage.computeParams(req.url)
    const data = await ServerPage.fetchData(req.hostname, match.params.id, match.params.key)
    return data
  }

  static computeParams(url) {
    return matchPath(url, {
        path: "/server/:id/:key?/:subkey?",
        exact: true,
        strict: false
    }) || {params: {}} // If no match, return a default that won't cause null dereferences
  }

  static async fetchData(host, id, post) {
    const manages = api.token() ? await api.manages(host, id) : await Promise.resolve(false)
    const [
      config,
      leaderboard,
      rewards,
      prefix,
      posts,
      currentPost,
      info,
    ] = await Promise.all([
      manages ? api.guildConfig(host, id) : Promise.resolve({}),
      api.guildLeaderboard(host, id),
      api.guildRewards(host, id),
      api.guildPrefix(host, id).then(data => data.prefix || "mew."),
      api.getPosts(host, id),
      post && /\d+/.test(post) ? api.getPost(host, id, post) : Promise.resolve(null),
      api.guildInfo(host, id),
    ])
    let currentPostAuthor
    if(currentPost) {
      currentPostAuthor = await api.getAuthor(host, currentPost.content.text.author)
    }
    // Filter out unique authors from custom posts. This will let us avoid
    // fetching info more than once for no reason :blobcatzippermouth:
    const authors = [...new Set(posts.filter(e => e.content.text).map(e => e.content.text.author))]
    let authorData = await Promise.all(authors.map(e => api.getAuthor(host, e)))
    authorData = authorData.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
    const [
      guild,
      channels,
      roles,
      webhooks
    ] = await Promise.all([
      api.cachedGuild(host, id),
      api.cachedChannels(host, id),
      api.cachedRoles(host, id),
      manages ? api.guildWebhooks(host, id) : Promise.resolve([]),
    ])
    return {
      manages: manages,
      config: config,
      leaderboard: leaderboard,
      rewards: rewards,
      prefix: prefix,
      currentPost: currentPost,
      currentPostAuthor: currentPostAuthor,
      posts: posts,
      info: info,
      authors: authorData,
      cache: {
        guild: guild,
        channels: channels,
        roles: roles,
        webhooks: webhooks,
      },
    }
  }

  render() {
    return (
      <ServerPageInternal fetchData={(host, id, post) => ServerPage.fetchData(host, id, post)}  {...this.props} />
    )
  }
}

const CommandCard = styled(PaddedCard)`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
`
