import React, { Component } from "react"

import { Box, Image, Heading, Text } from "@rebass/emotion"

import { Helmet } from "react-helmet"
import { Redirect } from "react-router"

import Container from "../comp/Container"
import NavLink from "../comp/NavLink"
import Card from "../comp/Card"
import storage from "../Storage"

import photo from "../assets/mewna.svg"

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      forceRerender: false
    }
  }

  componentDidMount() {
    storage.register(this)
  }

  componentWillUnmount() {
    storage.unregister(this)
  }

  updateRender() {
    this.setState({forceRerender: !this.state.forceRerender})
  }

  render() {
    if(storage.getToken()) {
      return <Redirect to="/home" />
    }
    return (
      <Container fakeProp={this.state.forceRerender}>
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
