import React, { Component } from "react"

import styled from "@emotion/styled"

import Card, { PaddedCard } from "../Card"
import FlexPadder from "../FlexPadder"
import { darkBackground, lightBackground, hoverBackground } from "../Utils"
import backgroundLookup from "../../Backgrounds"
import $ from "../../Translate"
import bigInt from "big-integer"
import { formatRelative } from 'date-fns'
import { MEWNA_EPOCH } from "../../Const"

import Markdown from "react-markdown"

export const renderPostBody = markdown => {
  return (
    <Markdown>
      {markdown}
    </Markdown>
  )
}

export const renderSystemPostText = (type, data) => {
  switch(type) {
    case "event.levels.global": {
      return $("en_US", "profile." + type)
        .replace("$name", data.name)
        .replace("$level", data.level)
    }
    case "event.money": {
      return $("en_US", "profile." + type)
        .replace("$name", data.name)
        .replace("$money", data.money)
    }
    case "event.account.background": {
      return $("en_US", "profile." + type)
        .replace("$name", data.name)
    }
    case "event.account.description": {
      return $("en_US", "profile." + type)
        .replace("$name", data.name)
    }
    case "event.account.displayName": {
      return $("en_US", "profile." + type)
        .replace("$name", data.name)
        .replace("$old", data.old)
        .replace("$new", data.newName)
    }
    case "event.server.name": {
      return $("en_US", "profile." + type)
        .replace("$server", data.name)
        .replace("$name", data.name)
    }
    case "event.server.description": {
      return $("en_US", "profile." + type)
        .replace("$server", data.name)
    }
    case "event.server.background": {
      return $("en_US", "profile." + type)
        .replace("$server", data.name)
    }
  }
}

export const renderSystemPost = (text, styles, key, date) => {
  return (
    <PaddedCard key={key} style={styles}>
      {text}<FlexPadder />{date}
    </PaddedCard>
  )
}

export const renderUserPost = (key, author, date, markdown, buttons) => {
  return (
    <PaddedCard key={key}>
      <PostHeader>
        <PostHeaderAvatar src={author.avatar} />
        {author.name}
        <FlexPadder />
        {date}
      </PostHeader>
      <div>
        <Markdown>
          {markdown}
        </Markdown>
      </div>
      <PostFooter>
        {buttons}
      </PostFooter>
    </PaddedCard>
  )
}

export const renderPost = (post, key, currentPostAuthor, authors, buttons, format) => {
  if(post.content.text) {
    // User post
    const data = post.content.text
    const now = new Date()
    const author = currentPostAuthor || authors[data.author]
    return renderUserPost(key, author, formatRelative(new Date(bigInt(post.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now),
      data.content, buttons())
  } else {
    // System post
    const data = post.content.data
    const now = new Date()
    let formats = {}
    let styles = {display: "flex", flexDirection: "row"}
    switch(data.type) {
      case "event.levels.global": {
        formats = renderFormats(format, data.type, ["name"])
        break
      }
      case "event.money": {
        formats = renderFormats(format, data.type, ["name", "money"])
        break
      }
      case "event.account.background": {
        formats = renderFormats(format, data.type, ["name"])
        styles = Object.assign(styles, {
          background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("${backgroundLookup(data.bg)}") center / cover`
        })
        break
      }
      case "event.account.description": {
        formats = renderFormats(format, data.type, ["name"])
        break
      }
      case "event.account.displayName": {
        formats = renderFormats(format, data.type, ["name", "old", "newName"])
        break
      }
      case "event.server.name": {
        formats = renderFormats(format, data.type, ["name"])
        break
      }
      case "event.server.description": {
        formats = renderFormats(format, data.type, ["name"])
        break
      }
      case "event.server.background": {
        formats = renderFormats(format, data.type, ["name"])
        styles = Object.assign(styles, {
          background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("${backgroundLookup(data.bg)}") center / cover`
        })
        break
      }
    }
    let text = renderSystemPostText(data.type, formats)

    return renderSystemPost(text, styles, key, formatRelative(new Date(bigInt(post.id).shiftRight(22).valueOf() + MEWNA_EPOCH), now))
  }
}

const renderFormats = (f, type, keys) => {
  const out = f(type, keys)
  return Object.assign({}, out)
}

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  border-bottom: 1px solid ${props => props.theme.colors.med};
  margin-bottom: 0.5em;
  padding-bottom: 0.5em;
`
const PostHeaderAvatar = styled.img`
  display: block;
  width: 24px;
  height: 24px;
  margin-right: 0.5em;
  border-radius: 50%;
`
const PostFooter = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  border-top: 1px solid ${props => props.theme.colors.med};
  margin-top: 0.5em;
  padding-top: 0.5em;
`
