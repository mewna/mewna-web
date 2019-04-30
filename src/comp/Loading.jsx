import React, { Component } from "react"
import styled from "@emotion/styled"

import ReactLoading from "react-loading"
import { BRAND_COLOUR } from "../Theme"

const LoadingWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
`

export default class extends Component {
  render() {
    return (
      <LoadingWrapper>
        <ReactLoading type="spin" color={BRAND_COLOUR} height={64} width={64} />
      </LoadingWrapper>
    )
  }
}