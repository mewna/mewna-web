import React, { Component } from "react"
import styled from "@emotion/styled"

import { darkBackground, textColor } from "./Utils"

const Button = styled.a`
  border: 0;
  background: none;
  box-shadow: none;
  border-radius: 2px;
  ${darkBackground}
  ${textColor}

  &:hover {
    cursor: pointer;
  }

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }
`

export const PaddedButton = styled(Button)`
  padding: 0.5em;
`

export default class extends Component {
  render() {
    return <Button {...this.props} />
  }
}
