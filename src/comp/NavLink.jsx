import React, { Component } from "react"
import NavLink from "react-router-dom/NavLink"

import styled from "@emotion/styled"
import { css } from "@emotion/core"
import { underlined } from "./Utils"

export default styled(NavLink)`
  color: ${props => props.theme.colors.text};

  &:link, &:visited, &:hover, &:active {
    color: ${props => props.theme.colors.text};
  }

  ${underlined}
`
