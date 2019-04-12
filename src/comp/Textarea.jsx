import styled from "@emotion/styled"

export default styled.textarea`
  background: ${props => props.theme.colors.med};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.dark};
  box-sizing: border-box;
  padding: 4px;
  border-radius: 2px;
  width: 100%;
  max-width: 100%;
  resize: none;

  &:hover, &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.brand};
  }
`