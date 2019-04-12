import styled from "@emotion/styled"
import {textColor} from "./Utils"

export default styled.button`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  margin-left: 1em;
  background: ${props => props.theme.colors.brand};
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  border: none;
  box-shadow: none;
  ${textColor};

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }

  &:hover {
    cursor: pointer;
  }
`