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
      this.handleChangeInternal = debounce(this.props.debounce || 1500, false, this.props.callback)
    } else {
      this.handleChangeInternal = debounce(this.props.debounce || 1500, false, e => {})
    }

    this.state = {
      charsLeft: this.maxChars - initial,
      textareaValue: this.props.value
    }
  }

  componentDidUpdate(prev) {
    // If we previously had a value on this textarea, and we're currently
    // holding a value in it, but then the value prop got cleared, we need to
    // clear this textarea's value.
    if(prev.value && !this.props.value && this.state.textareaValue) {
      this.setState({textareaValue: ""})
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
        charsLeft: this.maxChars - input.length,
        textareaValue: input
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
          value={this.state.textareaValue}
        />
        <TextCounter>
          {this.maxChars - this.state.charsLeft}/{this.maxChars}
        </TextCounter>
      </Relative>
    )
  }
}
