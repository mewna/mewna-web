import React, { Component } from "react"
import ServerPage from "../ServerPage"
import GridContainer, { InterGridSpacer } from "../../../comp/GridContainer"
import { PaddedCard, InternalWidthFixer } from "../../../comp/Card"

export default class extends Component {
  render() {
    return (
      <GridContainer>
        {this.props.renderCommands("music")}
      </GridContainer>
    )
  }
}
