import React, { Component } from "react"
import styled from "@emotion/styled"

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 4em;
  height: 1.5em;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.dark};
  transition: .4s;
  border-radius: 1em;

  &:before {
    position: absolute;
    content: "";
    height: 1em;
    width: 1em;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 0.75em;
  }

  input:checked + & {
    background-color: ${props => props.theme.colors.brand};
  }

  input:focus + & {
    /* box-shadow: 0 0 1px #2196F3; */
  }

  input:checked + &:before {
    transform: translateX(2.5em);
  }
`

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checked: !!this.props.checked
    }
  }

  onChange(e) {
    this.setState({checked: !this.state.checked}, () => {
      this.props.callback && this.props.callback(this.state.checked)
    })
  }

  render() {
    return (
      <Label>
        <input type="checkbox" checked={!!this.state.checked} onChange={e => this.onChange(e)} />
        <Slider />
      </Label>
    )
  }
}