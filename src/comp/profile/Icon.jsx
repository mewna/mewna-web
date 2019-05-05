import styled from "@emotion/styled"

const Icon = styled.img`
  border-radius: 50%;
  width: 128px;
  height: 128px;
  left: 0.5em;
`

export const SmallIcon = styled(Icon)`
  width: 64px;
  height: 64px;
`

export const VerySmallIcon = styled(Icon)`
  width: 32px;
  height: 32px;
`

export default Icon