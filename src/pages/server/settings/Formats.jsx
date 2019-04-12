import React, { Component } from "react"
import $ from "../../../Translate"

export default class BasicFormats extends Component {
  render() {
    return (
      <>
        <details>
          <summary>
          {$("en_US", "settings.desc.message-variables")}
          </summary>
          {this.renderBasics()}
        </details>
        <br />
        {this.renderDiscord()}
      </>
    )
  }

  renderServer() {
    return (
      <>
        <p><code>{"{server.name}"}</code>: {$("en_US", "settings.desc.format-vars.server-name")}</p>
        <p><code>{"{server.region}"}</code>: {$("en_US", "settings.desc.format-vars.server-region")}</p>
      </>
    )
  }

  renderUser() {
    return (
      <>
        <p><code>{"{user.name}"}</code>: {$("en_US", "settings.desc.format-vars.user-name")}</p>
        <p><code>{"{user.discriminator}"}</code>: {$("en_US", "settings.desc.format-vars.user-discriminator")}</p>
        <p><code>{"{user.mention}"}</code>: {$("en_US", "settings.desc.format-vars.user-mention")}</p>
        <p><code>{"{user.bot}"}</code>: {$("en_US", "settings.desc.format-vars.user-bot")}</p>
      </>
    )
  }

  renderBasics() {
    return (
      <>
        {this.renderServer()}
        {this.renderUser()}
      </>
    )
  }

  renderDiscord() {
    return (
      <details>
        <summary>
        {$("en_US", "settings.desc.discord-mentions")}
        </summary>
        <p><b>Channels</b>: {$("en_US", "settings.desc.format-discord.channel")}</p>
        <p><b>Custom Emojis</b>: {$("en_US", "settings.desc.format-discord.emoji")}</p>
      </details>
    )
  }
}

export class LevelsFormat extends BasicFormats {
  render() {
    return (
      <>
        <details>
          <summary>
          {$("en_US", "settings.desc.message-variables")}
          </summary>
          {this.renderBasics()}
          {this.renderLevels()}
        </details>
        <br />
        {this.renderDiscord()}
      </>
    )
  }

  renderLevels() {
    return (
      <>
        <p><code>{"{user.name}"}</code>: {$("en_US", "settings.desc.format-vars.user-name")}</p>
        <p><code>{"{level}"}</code>: {$("en_US", "settings.desc.format-vars.levels.level")}</p>
        <p><code>{"{xp}"}</code>: {$("en_US", "settings.desc.format-vars.levels.xp")}</p>
      </>
    )
  }
}

export class TwitchFormat extends BasicFormats {
  render() {
    return (
      <>
        <details>
          <summary>
          {$("en_US", "settings.desc.message-variables")}
          </summary>
          {this.renderTwitch()}
        </details>
        <br />
        {this.renderDiscord()}
      </>
    )
  }

  renderStart() {
    if(this.props.start) {
      return (
        <>
          <p><code>{"{stream.title}"}</code>: {$("en_US", "settings.desc.format-vars.stream.stream-title")}</p>
          <p><code>{"{stream.viewers}"}</code>: {$("en_US", "settings.desc.format-vars.stream.stream-viewers")}</p>
        </>
      )
    } else {
      return ""
    }
  }

  renderTwitch() {
    return (
      <>
        <p><code>{"{link}"}</code>: {$("en_US", "settings.desc.format-vars.stream.link")}</p>
        <p><code>{"{streamer.name}"}</code>: {$("en_US", "settings.desc.format-vars.stream.streamer-name")}</p>
        {this.renderStart()}
      </>
    )
  }
}
