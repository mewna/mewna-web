import React, { Component } from "react"
import { debounce } from "throttle-debounce"
import Textarea from "./Textarea";
import styled from "@emotion/styled"

const Relative = styled.div`
  position: relative;
`
const TextCounter = styled.div`
  position: absolute;
  bottom: 0.5em;
  right: 0.5em;
`

const MAX_CHARS = 2000

export default class DebouncedTextarea extends Component {
  constructor(props) {
    super(props)

    let initial = 0
    if (this.props.value) {
      initial = this.props.value.length
    }
    this.maxChars = this.props.maxChars ? this.props.maxChars : MAX_CHARS

    if (props.callback) {
      this.handleChangeInternal = debounce(1500, false, this.props.callback)
    } else {
      this.handleChangeInternal = debounce(1500, false, e => {})
    }

    this.state = {
      chars_left: this.maxChars - initial,
      textarea_value: this.props.value
    }
  }

  handleChange(e) {
    // noinspection JSUnresolvedVariable
    let input = e.target.value
    if (input.length > this.maxChars) {
      input = input.substring(0, this.maxChars)
    }
    this.handleChangeInternal(e.target)
    this.setState(
      {
        chars_left: this.maxChars - input.length,
        textarea_value: input
      }
    )
  }

  render() {
    return (
      <Relative>
        <Textarea
          onChange={e => this.handleChange(e)}
          rows={this.props["rows"]}
          min-rows={this.props["min-rows"]}
          value={this.state.textarea_value}
        />
        <TextCounter>
          {this.maxChars - this.state.chars_left}/{this.maxChars}
        </TextCounter>
      </Relative>
    )
  }
}
