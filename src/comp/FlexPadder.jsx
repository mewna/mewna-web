import React, { Component } from "react"

import styled from "@emotion/styled"

export default styled.span`
  margin-left: auto;
  margin-right: auto;
`

export const FlexPadderDesktop = styled.span`
  @media screen and (max-width: 768px) {
    margin: 0;
  }
  @media screen and (min-width: 769px) {
    margin-left: auto;
    margin-right: auto;
  }
`
