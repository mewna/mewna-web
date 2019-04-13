import styled from "@emotion/styled"

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: min-content;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`
export default Grid

export const FourColGrid = styled.div`
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

export const ThreeColGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const TwoColGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: min-content;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: min-content;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const InterGridSpacer = styled.div`
  margin: 0.75em;
  height: 0.75em;
  min-height: 0.75em;
  display: block;
  width: 100%;
`

export const ProfileGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-template-rows: min-content;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const SideGrid = styled(Grid)`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
  grid-column-gap: 2em;
  grid-row-gap: 2em;
  grid-auto-rows: min-content;
`