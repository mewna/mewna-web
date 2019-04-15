import styled from "@emotion/styled"

export default comp => {
  return styled(comp)`
    @media screen and (max-width: 768px) {
      display: flex !important;
    }
    @media screen and (min-width: 769px) {
      display: none !important;
    }
  `
}

export const HiddenDesktop = styled.div`
  @media screen and (max-width: 768px) {
    display: flex !important;
  }
  @media screen and (min-width: 769px) {
    display: none !important;
  }
`
