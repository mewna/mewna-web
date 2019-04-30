import React from "react"
import styled from "@emotion/styled"
import { PaddedCard } from "./Card"
import { darkBackground } from "./Utils"

const MewnaBaseToast = styled(PaddedCard)`
  width: 360px;
  line-height: 1.4;
  min-height: 40px;
  margin: 0.5em;
  user-select: none;
  ${darkBackground}

  @media screen and (max-width: 768px) {
    width: 100vw;
    margin-top: 1em !important;
    margin-bottom: -0.5em;
    margin-right: -0.5em;
    margin-left: 0;
  }
`
const MewnaSuccessToast = styled(MewnaBaseToast)`
`
const MewnaErrorToast = styled(MewnaBaseToast)`
`
export default props => {
  const { appearance, children } = props
  const Comp = appearance == "error" ? MewnaErrorToast : MewnaSuccessToast
  return (
    <Comp onClick={() => props.onDismiss && props.onDismiss()}>
      {children}
    </Comp>
  )
}