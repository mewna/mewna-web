import React, { Component } from "react"
import Helmet from "react-helmet"

import Container from "../comp/Container"

export default class extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>Mewna :: Premium</title>
        </Helmet>
        <Container style={{flexDirection: "column"}}>
          <h1>p r e m i u m</h1>
          <h4>now only $3/month (maybe $5/month)</h4>
          <ul>
            <li>upload bg image</li>
            <li>personal prefixes</li>
            <li>~~hats?~~</li>
            <li>~~expanded highlight~~</li>
            <li>profile/rank card badge</li>
            <li>shiny role in mewna guild (yarn)</li>
            <li>bonus to :white_flower:</li>
            <li>mew.daily autocollection</li>
          </ul>
        </Container>
      </>
    )
  }
}