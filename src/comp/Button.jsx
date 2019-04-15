import React, { Component } from "react"
import styled from "@emotion/styled"

import { medBackground, textColor } from "./Utils"

export default styled.button`
  border: 0;
  background: none;
  box-shadow: none;
  border-radius: 2px;
  padding: 0.5em;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  ${medBackground}
  ${textColor}

  &:hover {
    cursor: pointer;
  }

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }
`
