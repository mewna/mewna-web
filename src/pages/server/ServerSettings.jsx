import React, { Component } from "react"
import { PaddedCard } from "../../comp/Card"
import { ThreeColGrid } from "../../comp/GridContainer"
import NavLink from "../../comp/NavLink"
import $ from "../../Translate"

export default class extends Component {
  render() {
    return (
      <ThreeColGrid>
        {this.renderSettingsCard("General", $("en_US", "settings.general"))}
        {this.renderSettingsCard("Economy", $("en_US", "settings.economy"))}
        {this.renderSettingsCard("Levels", $("en_US", "settings.levels"))}
        {this.renderSettingsCard("Music", $("en_US", "settings.music"))}
        {this.renderSettingsCard("Notifications", $("en_US", "settings.notifications"))}
        {this.renderSettingsCard("Miscellaneous", $("en_US", "settings.misc"))}
      </ThreeColGrid>
    )
  }

  renderSettingsCard(name, desc) {
    return (
      <NavLink to={`/server/${this.props.match.params.id}/edit/${name.toLowerCase()}`} nounderline="true">
        <PaddedCard>
          <h3>{name}</h3>
          {desc}
        </PaddedCard>
      </NavLink>
    )
  }
}
