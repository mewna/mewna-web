import React, { Component } from "react"
import regeneratorRuntime from "regenerator-runtime"

import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import Container from "../../comp/Container"
import SideCard from "../../comp/profile/SideCard"
import PostEditor from "../../comp/profile/PostEditor"
import Button from "../../comp/Button"
import { NavButton } from "../../comp/NavLink"
import DeleteButton from "../../comp/DeleteButton"
import $ from "../../Translate"
import DebouncedTextarea from "../../comp/DebouncedTextarea"
import api from "../../Api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { withRouter } from "react-router"
import { success } from "../../Utils"
import { withToastManager } from "react-toast-notifications"
import { renderPost } from "../../comp/profile/Post"

const MIN_POST_LENGTH = 100

export default withRouter(withToastManager(class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postData: "",
      write: true,
      aboutText: this.props.info.aboutText,
      postLengthWarning: false,
      currentPost: null,
      currentPostAuthor: {},
      editingCurrentPost: false,
    }
  }

  async componentDidMount() {
    this.props.editRegister(this)
    if(this.props.postId) {
      const post = await api.getPost(api.clientHostname(), this.props.cache.guild.id, this.props.postId)
      const author = await api.getAuthor(api.clientHostname(), post.content.text.author)
      this.setState({currentPost: post, currentPostAuthor: author, editingCurrentPost: false, postData: post.content.text.content})
    }
  }
  
  componentWillUnmount() {
    this.props.editUnregister(this)
  }
  
  fetchEdits() {
    return {aboutText: this.state.aboutText}
  }

  resetEdits() {
    this.setState({aboutText: this.props.info.aboutText})
  }

  async componentDidUpdate(prevProps) {
    if(prevProps.info.aboutText !== this.props.info.aboutText) {
      this.setState({aboutText: this.props.info.aboutText})
    }
    if(!prevProps.postId && this.props.postId) {
      // Fetch the post
      const post = await api.getPost(api.clientHostname(), this.props.cache.guild.id, this.props.postId)
      const author = await api.getAuthor(api.clientHostname(), post.content.text.author)
      this.setState({currentPost: post, currentPostAuthor: author, editingCurrentPost: false, postData: post.content.text.content})
    } else if(prevProps.postId && !this.props.postId) {
      // Clear out state
      this.setState({currentPost: null, currentPostAuthor: null, editingCurrentPost: false, postData: ""})
    }
  }

  renderAbout() {
    if(this.props.editing) {
      return (
        <DebouncedTextarea
          maxChars={150}
          value={this.state.aboutText}
          debounce={10}
          callback={e => this.setState({aboutText: e.value})}
          />
      )
    } else {
      return this.props.info.aboutText
    }
  }

  render() {
    return (
      <Container>
        <ProfileGrid>
          <SideGrid>
            <SideCard>
              <h4>{$("en_US", "profile.about").replace("$name", this.props.cache.guild.name || "Unknown server")}</h4>
              {this.renderAbout()}
            </SideCard>
            <SideCard>
              <code>guilds.join</code> scope goes here
            </SideCard>
          </SideGrid>
          <Grid>
            {this.renderBody()}
          </Grid>
        </ProfileGrid>
      </Container>
    )
  }

  renderBody() {
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
          {this.renderPosts()}
        </>
      )
    }
  }

  renderPosts() {
    let key = 0
    return this.props.posts.map(e => this.renderPost(e, key++))
  }

  renderPost(post, key) {
    let bkey = 0
    const currentPostAuthor = this.state.currentPostAuthor && this.state.currentPostAuthor.id ? this.state.currentPostAuthor : null
    return renderPost(post, key, currentPostAuthor, this.props.authors, () => {
      if(post.content.text) {
        let viewButton = (
          <NavButton to={`/server/${this.props.cache.guild.id}/${post.id}`} nounderline="true" key={bkey++}>View</NavButton>
        )
        if(this.state.currentPost) {
          viewButton = ""
        }
        let deleteButton = ""
        let editButton = ""
        if(this.props.manages) {
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
              await api.deletePost(api.clientHostname(), this.props.cache.guild.id, post.id)
              this.props.updateRender()
              if(this.state.currentPost) {
                this.props.history.push(`/server/${this.props.cache.guild.id}`)
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

  renderEditor() {
    if(this.props.manages) {
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
                const out = await api.createPost(api.clientHostname(), this.props.cache.guild.id, data)
                this.setState({postData: ""})
                // TODO: Should this redirect to /server/:id/${out.id}?
                this.props.updateRender()
              }
            }
          }}
        />
      )
    } else {
      return ""
    }
  }
}))

