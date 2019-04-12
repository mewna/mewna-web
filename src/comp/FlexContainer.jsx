import styled from "@emotion/styled"

export default styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

export const DefaultFlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`