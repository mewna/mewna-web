import React, { Component } from "react"
import GridContainer, { InterGridSpacer } from "../../../comp/GridContainer"
import { PaddedCard, InternalWidthFixer } from "../../../comp/Card"
import DebouncedTextbox from "../../../comp/DebouncedTextbox"
import { success } from "../../../Utils"
import $ from "../../../Translate"
import { withToastManager } from "react-toast-notifications"

export default withToastManager(
  class extends Component {
    render() {
      return (
        <>
          <GridContainer>
            <PaddedCard>
              <h4>Currency Symbol</h4>
              <InternalWidthFixer>
                <DebouncedTextbox
                  maxLength={64}
                  value={this.props.config.economy.currencySymbol}
                  placeholder="Default: :white_flower:"
                  callback={target => {
                    const symbol = target.value || ":white_flower:"
                    if (symbol != this.props.config.economy.currencySymbol) {
                      const old = this.props.config.economy.currencySymbol
                      let config = Object.assign({}, this.props.config)
                      config.economy.currencySymbol = symbol
                      this.props.updateConfig(config, () => {
                        success(
                          this,
                          $("en_US", "settings.updates.change")
                            .replace("$setting", "Currency Symbol")
                            .replace("$old", old || ":white_flower:")
                            .replace("$new", symbol || ":white_flower:")
                        )
                      })
                    }
                  }}
                />
              </InternalWidthFixer>
            </PaddedCard>
          </GridContainer>
          <InterGridSpacer />
          <GridContainer>{this.props.renderCommands("economy")}</GridContainer>
        </>
      )
    }
  }
)
