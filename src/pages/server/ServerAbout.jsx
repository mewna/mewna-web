import React, { Component } from "react"

import styled from "@emotion/styled"

import ServerPage from "./ServerPage"
import renderPost, { PostContainer } from "../../comp/profile/Post"
import { PaddedCard } from "../../comp/Card"
import GridContainer from "../../comp/GridContainer"
import Link from "../../comp/Link"

const AboutGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 1em;
  grid-row-gap: 1em;
  grid-auto-rows: 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export default class extends ServerPage {
  _render() {
    return (
      <GridContainer>
        <PaddedCard>
          <AboutGrid>
            <div>
              <h2>About</h2>
              Created: January 8, 2017
              <br />
              <br />
              Invite link:{" "}
              <Link
                href="https://discord.gg/UwdDN6r"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://discord.gg/UwdDN6r
              </Link>
              <br />
              <br />
              <Link href="">Add Mewna to this server</Link> to show things like
              member count.
            </div>
            <div>
              <h2>Description</h2>
              Mewna Comewnaty is that cool place that does neat things and is
              the reason you're even staring at this page :^) We do cool things
              and stuff and we also have Jet and he's pretty cool.
              <br />
              <br />
              We have:
              <ul>
                <li>memes</li>
                <li>Jet</li>
                <li>mantaro man</li>
                <li>more memes</li>
              </ul>
            </div>
          </AboutGrid>
        </PaddedCard>
      </GridContainer>
    )
  }
}
