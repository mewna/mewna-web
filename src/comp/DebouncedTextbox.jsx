import React, { Component } from "react"
import { debounce } from "throttle-debounce"
import Textbox from "./Textbox"

export default class extends Component {
  constructor(props) {
    super(props)
    if (props.callback) {
      this.handleChangeInternal = debounce(500, false, this.props.callback)
    } else {
      this.handleChangeInternal = debounce(500, false, e => {})
    }
    this.state = { value: props.value || "" }
  }

  handleChange(e) {
    e.persist()
    let input = e.target.value
    this.setState({ value: input }, () => {
      this.handleChangeInternal(e.target)
    })
  }

  render() {
    let props = Object.assign({}, this.props)
    delete props.callback
    delete props.value
    return (
      <Textbox
        type="text"
        onChange={e => this.handleChange(e)}
        value={this.state.value}
        {...props}
      />
    )
  }
}
