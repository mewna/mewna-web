import Select from "react-select"
import Async from "react-select/lib/Async"
import styled from "@emotion/styled"
import {
  darkBackground,
  lightBackground,
  medBackground,
  textColor
} from "./Utils"

export default styled(Select)`
  min-width: 16em;

  .Select__control {
    border-color: ${props => props.theme.colors.dark};
    ${textColor};
    ${medBackground};
  }

  .Select__control:hover,
  .Select__control--is-focused {
    border-color: ${props => props.theme.colors.brand};
    box-shadow: none;
  }

  .Select__menu {
    ${medBackground};
  }

  .Select__option,
  .Select__single-value,
  .Select__input,
  .Select__placeholder {
    ${textColor};
  }

  .Select__option--is-focused {
    ${lightBackground};
  }
`

export const AsyncSelect = styled(Async)`
  min-width: 16em;

  .Select__control {
    border-color: ${props => props.theme.colors.dark};
    ${textColor};
    ${medBackground};
  }

  .Select__control:hover,
  .Select__control--is-focused {
    border-color: ${props => props.theme.colors.brand};
    box-shadow: none;
  }

  .Select__menu {
    ${medBackground};
  }

  .Select__option,
  .Select__single-value,
  .Select__input,
  .Select__placeholder {
    ${textColor};
  }

  .Select__option--is-focused {
    ${lightBackground};
  }
`