import React, { Component } from "react"
import api from "../../Api"
import { backendUrl } from "../../Const"
import $ from "../../Translate"

import { Helmet } from "react-helmet"
import { Redirect } from "react-router"
import styled from "@emotion/styled"
import { withRouter } from "react-router"

import { PaddedCard } from "../../comp/Card"
import Container from "../../comp/Container"
import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import { VerySmallIcon } from "../../comp/profile/Icon"
import { renderPost, NoPosts } from "../../comp/profile/Post"
import FlexContainer from "../../comp/FlexContainer"
import { HiddenMobile } from "../../comp/HiddenMobile";

import storage from "../../Storage"
import mewna from "../../assets/mewna-avatar.png"
import { lightBackground } from "../../comp/Utils"
import Loading from "../../comp/Loading"
import Details from "../../comp/Details"
import { NavButton } from "../../comp/NavLink"

const SidebarTile = styled.div`
  padding: 1em;
  padding-left: 1em !important;
  padding-right: 0 !important;
`
const HoverableSidebarTile = styled(SidebarTile)`
  &:hover {
    cursor: pointer;
    ${lightBackground};
  }
`

const ServerTile = withRouter(class extends Component {
  componentDidMount() {
    if (typeof window !== undefined) {
      window.addEventListener("message", this.handleMessage.bind(this))
    }
  }

  componentWillUnmount() {
    if (typeof window !== undefined) {
      window.removeEventListener("message", this.handleMessage.bind(this))
    }
  }

  handleMessage(e) {
    const data = e.data
    if (data.type === "addbot") {
      this.props.history.push(`/server/${data.guild}`)
    }
  }

  promptOrRedirect() {
    if(this.props.guild.exists) {
      this.props.history.push(`/server/${this.props.guild.id}`)
    } else if(!this.props.unmanaged) {
      const hostname = api.clientHostname()
      window.open(
        `${backendUrl(hostname)}/api/oauth/addbot/start?guild=${this.props.guild.id}`,
        `Add Mewna to ${this.props.guild.name}`,
        "resizable=no,menubar=no,scrollbars=yes,status=no,height=600,width=400"
      )
    } else {
      // TODO: How to notify the user??
    }
  }

  render() {
    return (
      <HoverableSidebarTile onClick={ev => {
        ev.preventDefault()
        this.promptOrRedirect()
      }} style={this.props.style || {}}>
        <FlexContainer style={{justifyContent: "inherit"}}>
          <VerySmallIcon src={this.props.guild.icon
            ? `https://cdn.discordapp.com/icons/${this.props.guild.id}/${this.props.guild.icon}.png`
            : mewna}
          style={{marginRight: "0.5em"}} />
          {this.props.guild.name}
        </FlexContainer>
      </HoverableSidebarTile>
    )
  }
})

export default class HomePage extends Component {
  static async getInitialProps(ctx) {
    const { req } = ctx
    // Safety measure since this *can* be called on the client
    const hostname = req ? req.hostname : api.clientHostname()
    const [
      guilds,
      unmanagedGuilds,
      user,
      posts
    ] = await HomePage.fetchData(hostname)
    // Filter out unique authors from custom posts. This will let us avoid
    // fetching info more than once for no reason :blobcatzippermouth:
    const authors = [...new Set(posts.filter(e => e.content.text).map(e => e.content.text.author))]
    const authorData = await HomePage.fetchAuthors(hostname, authors)
    return {
      guilds: guilds,
      unmanagedGuilds: unmanagedGuilds,
      user: user,
      posts: posts,
      authorData: authorData,
    }
  }

  static async fetchData(host) {
    return await Promise.all([
      api.getGuilds(host),
      api.getUnmanagedGuilds(host),
      api.getUser(host, api.userId()),
      api.getHomepage(host)
    ])
  }

  static async fetchAuthors(hostname, authors) {
    let authorData = await Promise.all(authors.map(e => api.getAuthor(hostname, e)))
    authorData = authorData.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})
    return authorData
  }

  constructor(props) {
    super(props)
    this.state = {
      guilds: props.guilds || [],
      unmanagedGuilds: props.unmanagedGuilds || [],
      user: props.user || {},
      forceRerender: false,
      posts: props.posts || [],
      authorData: props.authorData || {},
    }
  }

  async componentDidMount() {
    const [guilds, unmanagedGuilds, user, posts] = await HomePage.fetchData(api.clientHostname())
    const authors = [...new Set(posts.filter(e => e.content.text).map(e => e.content.text.author))]
    const authorData = await HomePage.fetchAuthors(api.clientHostname(), authors)
    this.setState({
      guilds: guilds,
      unmanagedGuilds: unmanagedGuilds,
      user: user,
      posts: posts,
      authorData: authorData,
    })
    storage.register(this)
  }

  componentWillUnmount() {
    storage.unregister(this)
  }

  updateRender() {
    this.setState({forceRerender: !this.state.forceRerender})
  }

  renderGuilds() {
    const cards = []
    let key = 0
    cards.push(
      <div style={{paddingLeft: "1em"}} key={key++}>
        <h3>{$("en_US", "home.managed-guilds")}</h3>
      </div>
    )
    if(this.state.guilds.length === 0) {
      cards.push(
        <div style={{paddingLeft: "1em"}} key={key++}>
          {$("en_US", "home.no-managed-guilds")}
        </div>
      )
    } else {
      const _cards = []
      this.state.guilds.forEach(e => {
        _cards.push(
          <ServerTile guild={e} key={key++} />
        )
      })
      cards.push(
        <Details open style={{paddingLeft: "1em"}} key={key++}>
          {_cards}
        </Details>
      )
    }
    cards.push(
      <div style={{paddingLeft: "1em"}} key={key++}>
        <h3>{$("en_US", "home.other-guilds")}</h3>
      </div>
    )

    if(this.state.unmanagedGuilds.filter(e => e.exists).length === 0) {
      cards.push(
        <div style={{paddingLeft: "1em"}} key={key++}>
          {$("en_US", "home.no-other-guilds")}
        </div>
      )
    } else {
      const _cards = []
      this.state.guilds.forEach(e => {
        _cards.push(
          <ServerTile guild={e} key={key++} unmanaged={true} />
        )
      })
      cards.push(
        <Details open style={{paddingLeft: "1em"}} key={key++}>
          {_cards}
        </Details>
      )
    }
    return cards
  }

  render() {
    if(!storage.getToken()) {
      return (
        <Redirect to="/" />
      )
    }
    if(!this.state.user.id && this.state.guilds.length === 0) {
      return (
        <Loading />
      )
    }
    return (
      <>
        <Helmet>
          <title>Mewna :: Your homepage</title>
        </Helmet>
        <Container style={{flexDirection: "column"}} fakeProp={this.state.forceRerender}>
          <HiddenMobile style={{marginTop: "4em"}} />
          <ProfileGrid>
            <SideGrid style={{gridRowGap: "0.5em"}}>
              <SidebarTile>
                <FlexContainer style={{justifyContent: "inherit"}}>
                  <VerySmallIcon src={this.state.user.avatar || this.state.user.discord.avatar}
                    style={{marginRight: "0.5em", width: "32px", height: "32px"}}
                    />
                  {this.state.user.displayName}
                </FlexContainer>
              </SidebarTile>
              <div>
                {this.renderGuilds()}
              </div>
            </SideGrid>
            <Grid>
              {this.renderPosts()}
            </Grid>
          </ProfileGrid>
        </Container>
      </>
    )
  }

  renderPosts() {
    if(!this.state.posts || this.state.posts.length === 0) {
      return (
        <NoPosts>
          {$("en_US", "home.no-posts")}
        </NoPosts>
      )
    } else {
      const cards = []
      let key = 0 
      this.state.posts.forEach(e => cards.push(this.renderPost(e, key++)))
      return cards
    }
  }

  renderPost(post, key) {
    let bkey = 0
    return renderPost(post, key, null, this.state.authorData, () => {
      if(post.content.text) {
        let viewButton = (
          <NavButton to={`/server/${post.author}/${post.id}`} nounderline="true" key={bkey++}>View</NavButton>
        )
        return [viewButton]
      } else {
        return []
      }
    }, (type, data, keys) => {
      switch(type) {
        case "event.server.name": {
          return {
            "name": this.props.cache.guild.name
          }
        }
        case "event.server.description": {
          return {
            "name": this.props.cache.guild.name
          }
        }
        case "event.server.background": {
          return {
            "name": this.props.cache.guild.name
          }
        }
      }
    })
  }
}