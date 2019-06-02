import React, { Component } from "react"
import styled from "@emotion/styled"
import $ from "../Translate"

const Details = styled.details`
  &:hover {
    cursor: pointer;
  }
`

export default class extends Component {
  render() {
    return (
      <Details {...this.props}>
        <summary>{$("en_US", "misc.details")}</summary>
        {this.props.children}
      </Details>
    )
  }
}