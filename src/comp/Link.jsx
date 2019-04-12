import React, { Component } from "react"

import styled from "@emotion/styled"
import { underlined } from "./Utils"

const Anchor = styled.a`
  color: ${props => props.theme.colors.text};

  &:link {
    color: ${props => props.theme.colors.text};
  }
  &:visited {
    color: ${props => props.theme.colors.text};
  }
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  &:active {
    color: ${props => props.theme.colors.text};
  }

  ${underlined}
`

export default class Link extends Component {
  render() {
    return <Anchor {...this.props} />
  }
}
