import React, { Component } from "react"
import styled from "@emotion/styled"

const Textarea = styled.textarea`
  background: ${props => props.theme.colors.med};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.dark};
  box-sizing: border-box;
  padding: 4px;
  border-radius: 2px;
  width: 100%;
  max-width: 100%;
  resize: vertical;
  min-height: 8em;

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }
`
export default Textarea

export class TextareaWithCallback extends Component {
  onChange(e) {
    e.preventDefault()
    this.props.callback && this.props.callback(e.target)
  }

  render() {
    return (
      <Textarea
        onChange={e => this.onChange(e)}
        rows={this.props["rows"]}
        min-rows={this.props["min-rows"]}
        value={this.props.value}
      />
    )
  }
}