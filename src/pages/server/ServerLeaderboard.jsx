import React, { Component } from "react"
import { backendUrl } from "../../Const"
import regeneratorRuntime from "regenerator-runtime"
import { PaddedCard } from "../../comp/Card"
import SideCard from "../../comp/profile/SideCard"
import FlexPadder from "../../comp/FlexPadder"
import Grid, { ProfileGrid, SideGrid } from "../../comp/GridContainer"
import { SmallIcon } from "../../comp/profile/Icon"
import { NoPosts } from "../../comp/profile/Post"
import NavLink from "../../comp/NavLink"
import { darkBackground, brandBackground, lightBackground } from "../../comp/Utils"
import lookupBackground from "../../Backgrounds"
import api from "../../Api"
import groupBy from "lodash.groupby"

import styled from "@emotion/styled"
import $ from "../../Translate"
import Container from "../../comp/Container"
import storage from "../../Storage"
import getTheme from "../../Theme"
import FlexContainer, { DefaultFlexContainer } from "../../comp/FlexContainer"
import InfiniteScroll from "react-infinite-scroller"
import { LoadingSmall } from "../../comp/Loading"

const LeaderboardGrid = styled(Grid)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: fit-content(80px);
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: fit-content(80px);
`
const RolePill = styled.span`
  height: 1.5em;
  border-radius: 0.75em;
  padding: 2px;
  padding-left: 8px;
  padding-right: 8px;
  margin: 4px;
  margin-left: 0;
  margin-right: 6px;
  border-style: solid;
  border-width: 2px;
  box-sizing: border-box;
  white-space: nowrap;
`

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canLoadMore: true,
      leaderboard: props.leaderboard
    }
  }

  async loadMore() {
    const nextPage = await api.guildLeaderboard(api.clientHostname(), this.props.cache.guild.id, this.state.leaderboard.length)
    let newState = {
      canLoadMore: true,
      leaderboard: this.state.leaderboard,
    }
    if(nextPage.length === 0) {
      newState.canLoadMore = false
    } else {
      newState.leaderboard.push(...nextPage)
    }
    this.setState(newState)
  }

  render() {
    return (
      <Container>
        <ProfileGrid>
          <SideGrid>
            <SideCard>
              <h3>{$("en_US", "levels.role-rewards")}</h3>
              {this.renderRewards()}
            </SideCard>
            <SideCard>
              <h3>{$("en_US", "levels.how-it-works")}</h3>
              <p>{$("en_US", "levels.exp-gain")}</p>
              <p>{$("en_US", "levels.view-rank").replace("$prefix", this.props.prefix)}</p>
            </SideCard>
          </SideGrid>
          <InfiniteScroll
            pageStart={0}
            loadMore={() => this.loadMore()}
            hasMore={this.state.canLoadMore}
            loader={
              <div key={"aaaaaaaaaaaaaaaaaaaaaaa"} style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <LoadingSmall />
              </div>
            }
            >
            <LeaderboardGrid>
              {this.renderCards()}
            </LeaderboardGrid>
          </InfiniteScroll>
        </ProfileGrid>
      </Container>
    )
  }

  renderRewards() {
    if(this.props.rewards.length == 0) {
      return (
        <div>
          {$("en_US", "levels.no-rewards").replace("$name", this.props.cache.guild.name || "Unknown server")}
        </div>
      )
    } else {
      const cards = []
      let key = 0
      const groups = groupBy(this.props.rewards, "level")
      Object.keys(groups).forEach(level => {
        const roles = groups[level]
        const roleTexts = []
        roles.forEach(obj => {
          const { role } = obj
          const name = role.name
          let color = role.color.toString(16)
          if(color === "1fffffff") {
            color = "ffffff"
          }
          color = "#" + color
          roleTexts.push(
            <RolePill key={key++} style={{color: color, borderColor: color}}>
              {name}
            </RolePill>
          )
        })
        cards.push(
          <div key={key++}>
            <strong>{$("en_US", "settings.desc.levels.level")} {level}</strong>
            <DefaultFlexContainer style={{flexWrap: "wrap"}}>
              {roleTexts}
            </DefaultFlexContainer>
          </div>
        )
      })
      return (
        <div>
          {cards}
        </div>
      )
    }
  }

  renderNoLevels() {
    return (
      <NoPosts>
        {$("en_US", "levels.no-levels")}
      </NoPosts>
    )
  }

  renderCards() {
    let leaderboard = this.props.leaderboard
    if(this.state && this.state.leaderboard) {
      leaderboard = this.state.leaderboard
    }
    if(leaderboard.length === 0) {
      return this.renderNoLevels()
    }
    const cards = []
    let key = 0
    leaderboard.forEach(e => {
      const levelProgress = e.nextLevelXp - e.currentLevelXp - e.xpNeeded
      const levelTotal = e.userXp - e.currentLevelXp + e.xpNeeded
      const background = lookupBackground(e.customBackground)
      const dashOffset = 200.96 * (1 - (levelProgress / levelTotal))
      const theme = getTheme(storage.getLightTheme())
      cards.push(
        <RankCard key={key++} style={{background: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url("${background}") center / cover`}}>
          <RankNumber>
            #{e.playerRank}
          </RankNumber>
          <NavLink to={`/user/${e.accountId}`} nounderline="true">
            <IconWrapper>
              <SmallIcon src={e.avatar} alt="avatar" />
            </IconWrapper>
          </NavLink>
          <span style={{marginLeft: "0.5em"}} />
          <NameText>
            <NavLink to={`/user/${e.accountId}`} nounderline="true">
              <span>{e.name}</span><span>#{e.discrim}</span>
            </NavLink>
          </NameText>
          <ProgressBarBase>
            <ProgressBarText>
              {levelProgress} / {levelTotal} EXP
              <FlexPadder />
              Level {e.userLevel}
            </ProgressBarText>
            <ProgressBar percent={levelProgress / levelTotal} />
          </ProgressBarBase>
          <ProgressBarMobile>
            <ProgressBarCircle>
              <circle cx={32} cy={32} r='28' fill="none" stroke={theme.colors.dark} strokeWidth="4" />
              <circle cx={-32} cy={32} r='28' fill="none" stroke={theme.colors.brand} strokeWidth="4"
                strokeDasharray="200.96" strokeDashoffset={dashOffset} transform="rotate(-90)" />
            </ProgressBarCircle>
            <ProgressBarMobileText>
              LVL<br />
              {e.userLevel}
            </ProgressBarMobileText>
          </ProgressBarMobile>
        </RankCard>
      )
    })
    return cards
  }
}

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
`
const NameText = styled.div`
  width: 50%;
`
const RankCard = styled(PaddedCard)`
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
`
const RankNumber = styled.div`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border-radius: 4px;
  padding: 0.5em;
  margin-right: 0.5em;
  ${lightBackground}
`
const ProgressBarBase = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 0.5em;
  padding-right: 0.5em;

  @media screen and (max-width: 768px) {
    display: none !important;
  }
`
const ProgressBarText = styled.div`
  display: flex;
  flex-direction: row;
`
const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  ${darkBackground}

  &:after {
    content: ' ';
    display: block;
    width: calc(100% * ${props => props.percent});
    height: 4px;
    border-radius: 2px;
    ${brandBackground};
  }
`
const ProgressBarMobile = styled.div`
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    position: relative;
    width: 64px;
    height: 64px;
  }
  @media screen and (min-width: 769px) {
    display: none;
  }
`
const ProgressBarCircle = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 64px;
  height: 64px;
`
const ProgressBarMobileText = styled.div`
  position: absolute;
  top: 32;
  left: 32;
`
