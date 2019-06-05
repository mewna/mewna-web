import styled from "@emotion/styled"

export default comp => {
  return styled(comp)`
    @media screen and (max-width: 768px) {
      display: none;
    }
    @media screen and (min-width: 769px) {
      display: flex;
    }
  `
}

export const HiddenMobile = styled.div`
  @media screen and (max-width: 768px) {
    display: none;
  }
  @media screen and (min-width: 769px) {
    display: flex;
  }
`