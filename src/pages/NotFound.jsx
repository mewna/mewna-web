import React, { Component } from "react"
import styled from "@emotion/styled"
import { NavButton } from "../comp/NavLink"
import { darkBackground } from "../comp/Utils"

export default class extends Component {
  render() {
    return (
      <VHCenter>
        <h1>404 Not Found</h1>
        <p>It looks like you got lost...</p>
        <VisibleNavButton to="/" nounderline="true">Back to safety</VisibleNavButton>
      </VHCenter>
    )
  }
}

const VHCenter = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  align-content: center;
`
const VisibleNavButton = styled(NavButton)`
  ${darkBackground}
`
