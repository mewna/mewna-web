import React, { Component } from "react"
import ServerPage from "../ServerPage"
import GridContainer from "../../../comp/GridContainer"
import { PaddedCard } from "../../../comp/Card"

export default class extends Component {
  render() {
    return (
      <GridContainer>
        {this.props.renderCommands("misc")}
        {this.props.renderCommands("emotes")}
      </GridContainer>
    )
  }
}