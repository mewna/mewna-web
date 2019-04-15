import React, { Component } from "react"

import Grid, { SideGrid, ProfileGrid } from "../../comp/GridContainer"
import Container from "../../comp/Container"
import SideCard from "../../comp/profile/SideCard"
import { TextareaWithCallback } from "../../comp/Textarea"
import { PaddedCard } from "../../comp/Card"
import Button from "../../comp/Button"
import $ from "../../Translate"
import { renderPostBody } from "../../comp/profile/Post"
import styled from "@emotion/styled"
import { lightBackground, textColor, medBackground } from "../../comp/Utils"

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postData: "",
      write: true,
      aboutText: this.props.info.aboutText,
    }
  }

  componentDidMount() {
    this.props.editRegister(this)
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

  componentDidUpdate(prevProps) {
    if(prevProps.info.aboutText !== this.props.info.aboutText) {
      this.setState({aboutText: this.props.info.aboutText})
    }
  }

  renderAbout() {
    if(this.props.editing) {
      return (
        <TextareaWithCallback
          value={this.state.aboutText} callback={e => this.setState({aboutText: e.value})}
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
              maybe an ad idk
            </SideCard>
          </SideGrid>
          <Grid>
            {this.renderEditor()}
          </Grid>
        </ProfileGrid>
      </Container>
    )
  }

  renderEditor() {
    if(this.props.manages) {
      return (
        <PaddedCard>
          <EditorContainer>
            <EditorTab selected={this.state.write} onClick={() => this.setState({write: true})}>Write</EditorTab>
            <EditorTab selected={!this.state.write} onClick={() => this.setState({write: false})}>Preview</EditorTab>
          </EditorContainer>
          <EditorContainer>
            <SlightMargin>
              {this.renderEditorTextarea()}
              {this.renderEditorPreview()}
            </SlightMargin>
          </EditorContainer>
          <Button>POST</Button>
        </PaddedCard>
      )
    } else {
      return ""
    }
  }

  renderEditorTextarea() {
    if(this.state.write) {
      return <TextareaWithCallback
        value={this.state.postData}
        min-rows={8}
        rows={8}
        callback={e => {
          this.setState({postData: e.value})
        }}
      />
    } else {
      return ""
    }
  }

  renderEditorPreview() {
    if(this.state.write) {
      return ""
    } else {
      if(this.state.postData) {
        return renderPostBody(this.state.postData)
      } else {
        return $("en_US", "profile.post.no-content")
      }
    }
  }
}

const EditorTab = styled.button`
  border: 0;
  border-bottom: 2px solid ${props => props.selected ? props.theme.colors.brand : "transparent"};
  background: none;
  box-shadow: none;
  border-radius: 2px;
  padding: 6px;
  ${lightBackground}
  ${textColor}

  &:hover {
    cursor: pointer;
  }

  &:hover, &:focus {
    outline: none;
  }
`
const SlightMargin = styled.div`
  margin-bottom: 1em;
`
const EditorContainer = styled.div`
  margin-bottom: 1em;
  border-bottom: 1px solid ${props => props.theme.colors.med};
`
