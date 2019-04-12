import { css } from "@emotion/core";

export const underlined = props => {
  if (props.nounderline) {
    return css`
      text-decoration: none;
    `;
  } else {
    return css`
      text-decoration: underline;
    `;
  }
};

export const brandBackground = props => {
  return css`
    background: ${props.theme.colors.brand};
  `;
};
export const hoverBackground = props => {
  return css`
    background: ${props.theme.colors.hoverBackground};
  `;
};
export const darkBackground = props => {
  return css`
    background: ${props.theme.colors.dark};
  `;
};
export const lightBackground = props => {
  return css`
    background: ${props.theme.colors.light};
  `;
};
export const medBackground = props => {
  return css`
    background: ${props.theme.colors.med};
  `;
};
export const textColor = props => {
  return css`
    color: ${props.theme.colors.text};
  `;
};
