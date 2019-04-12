import React, {Component} from 'react'
import NavLink from 'react-router-dom/NavLink'
import Container from '../comp/Container'

export default class Docs extends Component {
  render() {
    return (
      <Container>
        Mewna has SSR docs too!?<br />
        <NavLink to="/">HOME</NavLink>
      </Container>
    )
  }
}