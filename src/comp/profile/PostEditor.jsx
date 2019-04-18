import React, { Component } from "react"
import DebouncedTextarea from "../DebouncedTextarea"
import { PaddedCard } from "../Card"
import $ from "../../Translate"
import styled from "@emotion/styled"
import { lightBackground, textColor } from "../Utils"
import { DefaultFlexContainer } from "../FlexContainer"
import Button from "../Button"
import regeneratorRuntime from "regenerator-runtime"
import { renderPostBody } from "./Post"

const MIN_POST_LENGTH = 100

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postData: this.props.postData || "",
      write: true,
      postLengthWarning: false,
    }
  }

  render() {
    let warning = ""
    if(this.state.postLengthWarning) {
      warning = $("en_US", "profile.post.too-short").replace("$number", MIN_POST_LENGTH)
    }
    let cancelButton = ""
    if(this.props.isEdit) {
      cancelButton = (
        <Button onClick={() => {
          this.props.cancelCallback && this.props.cancelCallback()
        }} style={{marginLeft: "1em"}}>
          Cancel
        </Button>
      )
    }
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
        <DefaultFlexContainer>
          <Button onClick={async () => {
            if(!this.state.postData || this.state.postData.length < MIN_POST_LENGTH) {
              this.setState({postLengthWarning: true}, () => {
                setTimeout(() => {
                  this.setState({postLengthWarning: false})
                }, 5000)
              })
            } else {
              this.props.postCallback && this.props.postCallback(this.state.postData)
              this.setState({postData: ""})
            }
          }}>Post</Button>
          {cancelButton}
        </DefaultFlexContainer>
        <div>
          {warning}
        </div>
      </PaddedCard>
    )
  }

  renderEditorTextarea() {
    if(this.state.write) {
      return <DebouncedTextarea
        maxChars={10000}
        value={this.state.postData}
        debounce={10}
        min-rows={8}
        rows={8}
        callback={e => this.setState({postData: e.value})}
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

const SlightMargin = styled.div`
  margin-bottom: 1em;
`
const EditorContainer = styled.div`
  margin-bottom: 1em;
  border-bottom: 1px solid ${props => props.theme.colors.med};
`
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
