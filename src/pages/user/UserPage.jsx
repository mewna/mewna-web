import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import { Helmet } from "react-helmet"
import { withToastManager } from 'react-toast-notifications'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { matchPath } from "react-router"

import ProfileHeader from "../../comp/profile/ProfileHeader"
import store from "../../Storage"
import api from "../../Api"
import Container from "../../comp/Container"
import Button from "../../comp/Button"
import backgroundLookup from "../../Backgrounds"
import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import SideCard from "../../comp/profile/SideCard"
import { renderPost, NoPosts } from "../../comp/profile/Post"
import PostEditor from "../../comp/profile/PostEditor"
import DebouncedTextarea from "../../comp/DebouncedTextarea"
import $ from "../../Translate"
import { success, error } from "../../Utils"
import { NavButton } from "../../comp/NavLink"
import DeleteButton from "../../comp/DeleteButton"

import { faHeart } from "@fortawesome/free-solid-svg-icons"
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons"
import styled from "@emotion/styled"
import Loading from "../../comp/Loading"

const BrandIcon = styled(FontAwesomeIcon)`
  color: ${props => props.theme.colors.brand};
`

const MIN_POST_LENGTH = 100

const UserPageInternal = withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.editRegistry = []
    this.state = {
      user: this.props.user,
      posts: this.props.posts,
      editing: false,
      currentPost: this.props.currentPost,
      editingCurrentPost: false,
      aboutText: "",
    }
  }

  editRegister(e) {
    this.editRegistry.push(e)
  }

  editUnregister(e) {
    this.editRegistry = this.editRegistry.filter(x => x !== e)
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.match.params.post !== this.props.match.params.post) {
      await this.updateRender()
    }
  }

  async updateRender() {
    const [user, posts, currentPost] = await this.props.fetchData(api.clientHostname(), this.props.match.params.id, this.props.match.params.post)
    this.setState({
      user: user,
      posts: posts,
      currentPost: currentPost,
      aboutText: user.aboutText,
    })
  }

  async componentDidMount() {
    store.register(this)
    await this.updateRender()
  }

  componentWillUnmount() {
    store.unregister(this)
  }

  render() {
    if(!this.state.user) {
      return <Loading />
    }
    const title = `Mewna :: ${this.state.user.displayName || "Unknown user"}'s profile`
    return (
      <Container>
        <Helmet>
          <title>{title}</title>
          <meta property="og:title" content={title} />
          <meta property="og:image" content={this.state.user.avatar || (this.state.user.discord ? this.state.user.discord.avatar : null)} />
          <meta property="og:description" content={this.state.user.aboutText} />
          <meta name="description" content={this.state.user.aboutText} />
        </Helmet>
        <ProfileHeader
          customBackground={backgroundLookup(this.state.user.customBackground || "/backgrounds/default/plasma")}
          avatar={this.state.user.avatar || (this.state.user.discord ? this.state.user.discord.avatar : null)}
          displayName={this.state.user.displayName}
          userId={this.state.user.id}
          premium={this.state.user.premium}
          currentPath={this.props.location.pathname}
          editRegister={e => this.editRegister(e)}
          editUnregister={e => this.editUnregister(e)}
          editClickCallback={() => {
            this.setState({editing: true})
          }}
          editCancelClickCallback={() => {
            this.setState({editing: false})
          }}
          editFinishClickCallback={async () => {
            const changes = this.editRegistry.map(e => e.fetchEdits()).reduce(((r, c) => Object.assign(r, c)), {})
            if(changes.customBackground === backgroundLookup(this.state.user.customBackground)) {
              changes.customBackground = this.state.user.customBackground
            }
            changes.aboutText = this.state.aboutText
            const host = api.clientHostname()
            const res = await api.updateUser(host, this.state.user.id, changes)
            if(res.errors) {
              error(this, $("en_US", "profile.edit.bad-config"))
              return false
            } else {
              success(this, $("en_US", "profile.edit.saved"))
              this.setState({editing: false})
              this.updateRender()
              return true
            }
          }}
        />

        <ProfileGrid>
          <SideGrid>
            <SideCard>
              <h4>{$("en_US", "profile.about").replace("$name", this.state.user.displayName || "Unknown user")}</h4>
              {this.renderAbout()}
            </SideCard>
          </SideGrid>
          <Grid>
            {this.renderTimeline()}
          </Grid>
        </ProfileGrid>
      </Container>
    )
  }

  renderTimeline() {
    if(this.state.currentPost) {
      if(this.state.editingCurrentPost) {
        return this.renderEditor()
      } else {
        return this.renderPost(this.state.currentPost, 0)
      }
    } else {
      return (
        <>
          {this.renderEditor()}
          {this.renderNoPosts()}
          {this.renderPosts()}
        </>
      )
    }
  }

  renderAbout() {
    if(this.state.editing) {
      return (
        <DebouncedTextarea
          maxChars={150}
          value={this.state.aboutText}
          debounce={10}
          callback={e => this.setState({aboutText: e.value})}
          />
      )
    } else {
      return this.state.user.aboutText
    }
  }

  renderNoPosts() {
    if(this.state.posts.length === 0) {
      return (
        <NoPosts>
          {$("en_US", "profile.no-posts").replace("$name", this.state.user.displayName || "Unknown user")}
        </NoPosts>
      )
    } else {
      return ""
    }
  }

  renderPosts() {
    let key = 0
    return this.state.posts.map(e => this.renderPost(e, key++))
  }

  renderUserPostButtons(post) {
    if(post.content.text) {
      let bkey = 0
      let viewButton = (
        <NavButton to={`/user/${this.state.user.id}/${post.id}`} nounderline="true" key={bkey++}>View</NavButton>
      )
      if(this.state.currentPost) {
        viewButton = ""
      }
      let deleteButton = ""
      let editButton = ""
      if(api.userId() === this.state.user.id) {
        let styles = {}
        if(this.state.currentPost) {
          editButton = (
            <Button onClick={() => {
              this.setState({editingCurrentPost: true})
            }} key={bkey++}>
              Edit
            </Button>
          )
        }
        deleteButton = (
          <DeleteButton style={styles} onClick={async () => {
            if(this.state.currentPost) {
              this.props.history.push(`/user/${this.state.user.id}`)
            }
            await api.deletePost(api.clientHostname(), this.state.user.id, post.id)
            this.updateRender()
            success(this, $("en_US", "profile.post.delete"))
          }} key={bkey++}>
            <FontAwesomeIcon icon={"trash"} />
          </DeleteButton>
        )
      }
      /*
      const hearts = (
        <>
          <Button key={bkey++}>
            <BrandIcon icon={faHeart} />
          </Button>
          <Button>
            <FontAwesomeIcon icon={farHeart} />
          </Button>
        </>
      )
      */
      const hearts = ""
      return [viewButton, editButton, hearts, deleteButton]
    } else {
      return []
    }
  }

  renderSystemPostText(type, data, keys) {
    switch(type) {
      case "event.levels.global": {
        return {
          "name": this.state.user.displayName,
          "level": data.level,
        }
      }
      case "event.money": {
        return {
          "name": this.state.user.displayName,
          "money": data.money,
        }
      }
      case "event.account.background": {
        return {
          "name": this.state.user.displayName,
        }
      }
      case "event.account.description": {
        return {
          "name": this.state.user.displayName,
        }
      }
      case "event.account.displayName": {
        return {
          "name": this.state.user.displayName,
          "old": data.old,
          "new": data["new"]
        }
      }
    }
  }

  renderPost(post, key) {
    const currentPostAuthor = this.state.currentPostAuthor && this.state.currentPostAuthor.id ? this.state.currentPostAuthor : null
    const authors = {}
    const author = Object.assign({}, this.state.user)
    author.name = author.displayName
    authors[this.state.user.id] = author
    return renderPost(post, key, currentPostAuthor, authors, () => this.renderUserPostButtons(post),
      (type, data, keys) => this.renderSystemPostText(type, data, keys))
  }

  renderEditor() {
    // tfw no atob
    if(this.state.user.id === api.userId()) {
      return (
        <PostEditor
          postData={this.state.currentPost ? this.state.currentPost.content.text.content : ""}
          isEdit={this.state.currentPost && this.state.editingCurrentPost}
          cancelCallback={() => {
            this.setState({editingCurrentPost: false, postData: this.state.currentPost.content.text.content})
          }}
          postCallback={async postData => {
            // Post it!
            const data = {
              author: api.userId(),
              content: postData,
              boops: [],
            }
            if(this.state.editingCurrentPost) {
              const out = await api.editPost(api.clientHostname(), this.props.match.params.id, this.props.match.params.post, data)
              this.setState({editingCurrentPost: false})
              await this.updateRender()
              const post = await api.getPost(api.clientHostname(), this.props.match.params.id, this.props.match.params.post)
              const author = await api.getAuthor(api.clientHostname(), post.content.text.author)
              this.setState({currentPost: post, currentPostAuthor: author, editingCurrentPost: false, postData: post.content.text.content})
            } else {
              const out = await api.createPost(api.clientHostname(), this.props.match.params.id, data)
              this.setState({postData: ""})
              // TODO: Should this redirect to /server/:id/${out.id}?
              this.updateRender()
            }
          }}
        />
      )
    } else {
      return ""
    }
  }
})

export default class UserPage extends Component {
  static async getInitialProps(ctx) {
    const { req } = ctx
    const match = UserPage.computeParams(req.url)
    const [user, posts, currentPost] = await UserPage.fetchData(req.hostname, match.params.id, match.params.post)
    return {
      user: user,
      posts: posts,
      currentPost: currentPost,
    }
  }

  static computeParams(url) {
    return matchPath(url, {
        path: "/user/:id/:post?",
        exact: true,
        strict: false
    }) || {params: {}} // If no match, return a default that won't cause null dereferences
  }

  static async fetchData(host, id, post) {
    const [user, posts] = await Promise.all([
      api.getUser(host, id),
      api.getPosts(host, id)
    ])
    const currentPost = post ? await api.getPost(host, id, post) : null
    return [user, posts, currentPost]
  }

  render() {
    return (
      <UserPageInternal fetchData={(host, id, post) => UserPage.fetchData(host, id, post)} {...this.props} />
    )
  }
}