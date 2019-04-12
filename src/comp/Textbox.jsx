import React, { Component } from "react"
import styled from "@emotion/styled"

const Textbox = styled.input`
  background: ${props => props.theme.colors.med};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.dark};
  padding: 4px;
  border-radius: 2px;
  box-sizing: border-box;
  width: 100%;

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }
`

export default class extends Component {
  render() {
    return <Textbox type="text" {...this.props} />
  }
}
