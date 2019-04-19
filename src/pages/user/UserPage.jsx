import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"
import { Helmet } from "react-helmet"
import { withToastManager } from 'react-toast-notifications'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import ProfileHeader from "../../comp/profile/ProfileHeader"
import store from "../../Storage"
import api from "../../Api"
import Container from "../../comp/Container"
import backgroundLookup from "../../Backgrounds"
import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import SideCard from "../../comp/profile/SideCard"
import { renderPost } from "../../comp/profile/Post"
import PostEditor from "../../comp/profile/PostEditor"
import DebouncedTextarea from "../../comp/DebouncedTextarea"
import $ from "../../Translate"
import { success, error } from "../../Utils"
import { NavButton } from "../../comp/NavLink"
import DeleteButton from "../../comp/DeleteButton"


const MIN_POST_LENGTH = 100

export default withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.editRegistry = []
    this.state = {
      user: {},
      posts: [],
      editing: false,
      currentPost: null,
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

  async updateRender() {
    const host = api.clientHostname()
    const user = await api.getUser(host, this.props.match.params.id)
    const posts = await api.getPosts(host, this.props.match.params.id)
    this.setState({
      user: user,
      posts: posts,
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
    return (
      <Container>
        <Helmet>
          <title>Mewna :: {this.state.user.displayName || "Unknown user"}'s profile</title>
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
            {this.renderEditor()}
            {this.renderPosts()}
          </Grid>
        </ProfileGrid>
      </Container>
    )
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

  renderPosts() {
    let key = 0
    return this.state.posts.map(e => this.renderPost(e, key++))
  }

  renderPost(post, key) {
    let bkey = 0
    const currentPostAuthor = this.state.currentPostAuthor && this.state.currentPostAuthor.id ? this.state.currentPostAuthor : null
    const authors = {}
    const author = Object.assign({}, this.state.user)
    author.name = author.displayName
    authors[this.state.user.id] = author
    return renderPost(post, key, currentPostAuthor, authors, () => {
      if(post.content.text) {
        let viewButton = (
          <NavButton to={`/user/${this.state.user.id}/${post.id}`} nounderline="true" key={bkey++}>View</NavButton>
        )
        if(this.state.currentPost) {
          viewButton = ""
        }
        let deleteButton = ""
        let editButton = ""
        if(typeof window !== "undefined" && api.userId() === this.state.user.id) {
          let styles = {}
          if(this.state.currentPost) {
            if(api.userId() === this.state.currentPostAuthor.id) {
              editButton = (
                <Button onClick={() => {
                  this.setState({editingCurrentPost: true})
                }} key={bkey++}>
                  Edit
                </Button>
              )
            } else {
              styles = {
                marginLeft: 0,
              }
            }
          }
          deleteButton = (
            <DeleteButton style={styles} onClick={async () => {
              await api.deletePost(api.clientHostname(), this.state.user.id, post.id)
              this.updateRender()
              if(this.state.currentPost) {
                this.props.history.push(`/user/${this.state.user.id}`)
              }
              success(this, $("en_US", "profile.post.delete"))
            }} key={bkey++}>
              <FontAwesomeIcon icon={"trash"} />
            </DeleteButton>
          )
        }
        return [viewButton, editButton, deleteButton]
      } else {
        return []
      }
    }, (type, data, keys) => {
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
    })
  }

  renderEditor() {
    // tfw no atob
    if(typeof window !== "undefined" && this.state.user.id === api.userId()) {
      return (
        <PostEditor
          postData={this.state.currentPost ? this.state.currentPost.content.text.content : ""}
          isEdit={this.state.currentPost && this.state.editingCurrentPost}
          cancelCallback={() => {
            this.setState({editingCurrentPost: false, postData: this.state.currentPost.content.text.content})
          }}
          postCallback={async postData => {
            if(!postData || postData.length < MIN_POST_LENGTH) {
              this.setState({postLengthWarning: true}, () => {
                setTimeout(() => {
                  this.setState({postLengthWarning: false})
                }, 5000)
              })
            } else if(postData) {
              // Post it!
              const data = {
                author: api.userId(),
                content: postData,
                boops: [],
              }
              if(this.state.editingCurrentPost) {
                const out = await api.editPost(api.clientHostname(), this.props.cache.guild.id, this.props.postId, data)
                this.setState({editingCurrentPost: false})
                await this.props.updateRender()
                const post = await api.getPost(api.clientHostname(), this.props.cache.guild.id, this.props.postId)
                const author = await api.getAuthor(api.clientHostname(), post.content.text.author)
                this.setState({currentPost: post, currentPostAuthor: author, editingCurrentPost: false, postData: post.content.text.content})
              } else {
                const out = await api.createPost(api.clientHostname(), this.state.user.id, data)
                this.setState({postData: ""})
                // TODO: Should this redirect to /server/:id/${out.id}?
                this.updateRender()
              }
            }
          }}
        />
      )
    } else {
      return ""
    }
  }
})