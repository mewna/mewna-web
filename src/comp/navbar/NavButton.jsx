import styled from "@emotion/styled"

import Button from "../Button"

const NavButton = styled(Button)`
  background: ${props => props.theme.colors.med};
  &:hover {
    background: ${props => props.theme.colors.med}
  }
  align-items: center;
  align-content: center;
  justify-content: center;
  display: flex;
`
export default NavButton

export const NavMenuButton = styled(NavButton)`
  display: block;
  text-align: left;
  justify-content: left;
  padding: 8px;
  margin-top: 4px;
  width: calc(100% - 16px);
  max-width: calc(100% - 16px);
  background: ${props => props.theme.colors.dark};
`
