import React, { Component } from "react"
import NavLink from "react-router-dom/NavLink"

import styled from "@emotion/styled"
import { css } from "@emotion/core"
import { underlined } from "./Utils"
import { medBackground, textColor } from "./Utils"

const MewnaNavLink = styled(NavLink)`
  color: ${props => props.theme.colors.text};

  &:link, &:visited, &:hover, &:active {
    color: ${props => props.theme.colors.text};
  }

  ${underlined}
`
export const ExternalLink = MewnaNavLink.withComponent("a")

export default MewnaNavLink

export const NavButton = styled(MewnaNavLink)`
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
