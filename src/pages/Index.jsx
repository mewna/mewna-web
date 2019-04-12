import React, { Component } from "react"

import { Box, Image, Heading, Text } from "@rebass/emotion"

import { Helmet } from "react-helmet"

import Container from "../comp/Container"
import Link from "../comp/Link"
import NavLink from "../comp/NavLink"
import Card from "../comp/Card"

import storage from "../Storage"

import photo from "../assets/mewna.svg"

export default class Index extends Component {
  render() {
    return (
      <Container>
        <Helmet>
          <title>Mewna :: Engage your community</title>
        </Helmet>
        <Box width={1 / 2}>
          Mewna has SSR!? NO HECKING WAY!!!
          <br />
          <NavLink to="/docs">DOCS</NavLink>
          <br />
          <br />
          <br />
          <Card>
            <Image src={photo} />
            <Box px={2}>
              <Heading as="h3">Card</Heading>
              <Text fontSize={0}>Small meta text</Text>
            </Box>
          </Card>
        </Box>
      </Container>
    )
  }
}
