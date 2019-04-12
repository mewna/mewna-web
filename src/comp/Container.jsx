import React, { Component } from "react"

import { Flex } from "@rebass/emotion"

import styled from "@emotion/styled"

export default styled(Flex)`
  margin: 0 auto;
  position: relative;
  flex-wrap: wrap;
  width: 100%;

  @media screen and (max-width: 768px) {
    margin: 0;
    /* For some reason, we need this to override the max:1471px width on mobile */
    width: 100% !important;
    max-width: 100% !important;
  }

  @media screen and (min-width: 1088px) {
    max-width: 960px;
    width: 960px;
  }

  @media screen and (max-width: 1279px) {
    max-width: 1152px;
    width: auto;
  }

  @media screen and (max-width: 1471px) {
    max-width: 1344px;
    width: auto;
  }

  @media screen and (min-width: 1280px) {
    max-width: 1152px;
    width: 1152px;
  }

  @media screen and (min-width: 1472px) {
    max-width: 1344px;
    width: 1344px;
  }
`
