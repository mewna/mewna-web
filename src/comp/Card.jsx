import React, { Component } from "react"
import { Box, Card, Image, Heading, Text } from "@rebass/emotion"
import styled from "@emotion/styled"

const NewCard = styled(Card)`
  background: ${props => props.theme.colors.light};
  border-radius: 2px;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.25);
`
export default NewCard

export const PaddedCard = styled(NewCard)`
  padding: 1em;
`

// I don't entirely understand why this is needed, but it is...
export const InternalWidthFixer = styled.div`
  width: 100%;
  box-sizing: border-box;
`