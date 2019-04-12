import { css } from "@emotion/core"
import styled from "@emotion/styled"

import hiddenMobile from "../HiddenMobile"
import NavLink from "../NavLink"
import { darkBackground, lightBackground, hoverBackground } from "../Utils"
import BaseProfileIcon from "./Icon"

export const HeaderContainer = styled.div`
  width: 100%;
  margin-top: 2rem;
  display: block;
  margin-bottom: 1rem;
  @media screen and (max-width: 768px) {
    margin-top: 0.5rem;
  }
`
export const backgroundImage = props => {
  return css`
    background-image: url("${props.background}");
  `
}
export const Header = styled.div`
  width: 100%;
  height: 24rem;
  background-size: cover;
  background-position: 0% 35%;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  ${backgroundImage}
`

export const tabBottomBorder = props => {
  return css`
    border-bottom: 4px solid ${props.theme.colors.brand};
  `
}
export const tabHover = props => {
  return css`
    &:hover {
      border-bottom: 4px solid ${props.theme.colors.brand};
    }
  `
}
export const Tab = styled(NavLink)`
  height: calc(100% - 6px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1em;
  border-top: 2px solid transparent;
  border-bottom: 4px solid transparent;
  padding-left: 1em;
  padding-right: 1em;
  ${tabHover}
`
export const SelectedTab = styled(Tab)`
  ${tabBottomBorder}
`
export const TabsBar = styled.div`
  width: calc(100% - 12em);
  height: 5em;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  display: flex;
  padding-left: 10em;
  padding-right: 2em;
  position: relative;
  ${darkBackground}

  ${Tab}:not(:first-of-type):not(:last-of-type),
  ${SelectedTab}:not(:first-of-type):not(:last-of-type) {
    margin-left: 0.5em;
    margin-right: 0.5em;
  }

  @media screen and (max-width: 768px) {
    padding-left: 0em;
    padding-right: 0em;
    width: 100%;
    justify-content: center;

    ${Tab}:not(:first-of-type):not(:last-of-type),
    ${SelectedTab}:not(:first-of-type):not(:last-of-type) {
      margin-left: 0.25em;
      margin-right: 0.25em;
    }
  }
`
export const ProfileIcon = styled(BaseProfileIcon)`
  position: absolute;
  top: -4em;
  ${lightBackground}

  @media screen and (max-width: 768px) {
    top: -16em;
    left: calc(50vw - 64px);
  }
`
export const ProfileName = styled.div`
  position: absolute;
  top: -2em;
  left: 7.25em;
  font-size: 1.5em;
  padding: 4px;
  border-radius: 2px;
  ${hoverBackground}

  @media screen and (max-width: 768px) {
    width: 50vw;
    top: -4em;
    left: calc(50vw - 25vw);
    text-align: center;
  }
`

export const HiddenTabText = hiddenMobile(styled.div`
  margin-right: 0.5em;
`)
