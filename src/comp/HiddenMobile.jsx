import styled from "@emotion/styled"

export default comp => {
  return styled(comp)`
    @media screen and (max-width: 768px) {
      display: none !important;
    }
    @media screen and (min-width: 769px) {
      display: flex !important;
    }
  `
}
