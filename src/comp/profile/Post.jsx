import React, { Component } from "react"

import { css } from "@emotion/core"
import styled from "@emotion/styled"

import Card from "../Card"
import Container from "../Container"
import { FlexPadderDesktop } from "../FlexPadder"
import hiddenMobile from "../HiddenMobile"
import NavLink from "../NavLink"
import { darkBackground, lightBackground, hoverBackground } from "../Utils"

export const PostContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
export const PostCardWrapper = styled.div`
  width: 100%;
  min-height: 21rem;
  position: relative;

  ${Card} {
    height: 100%;
  }
`
export const postCardImageComponent = img => styled.div`
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  width: 100%;
  height: 21rem;
  overflow: hidden;
  margin: 0;
  background: url("${img}") center / cover;
`
export const PostCardTitle = styled.div`
  min-height: 1rem;
  padding: 0.5em;
  position: absolute;
  bottom: 0;
  left: 0;
  width: calc(100% - 1em);
  text-align: left;
  ${hoverBackground}
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
`

export const renderCardImage = (url) => {
  const Pcard = postCardImageComponent(url)
  return <Pcard />
}

export default (title, author, imageUrl) => {
  return (
    <PostCardWrapper>
      <Card>
        {renderCardImage(imageUrl)}
        <PostCardTitle>
          <strong>{title}</strong>
          <br />
          by {author}
        </PostCardTitle>
      </Card>
    </PostCardWrapper>
  )
}