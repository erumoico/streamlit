/**
 * @license
 * Copyright 2018-2021 Streamlit Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react"
import { TextArea as TextAreaProto } from "autogen/proto"
import { WidgetStateManager, Source } from "lib/WidgetStateManager"

import { Textarea as UITextArea } from "baseui/textarea"
import InputInstructions from "components/shared/InputInstructions/InputInstructions"
import {
  StyledWidgetLabel,
  StyledWidgetLabelHelp,
} from "components/widgets/BaseWidget"
import TooltipIcon from "components/shared/TooltipIcon"
import { Placement } from "components/shared/Tooltip"

export interface Props {
  disabled: boolean
  element: TextAreaProto
  widgetMgr: WidgetStateManager
  width: number
}

interface State {
  /**
   * True if the user-specified state.value has not yet been synced to the WidgetStateManager.
   */
  dirty: boolean

  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: string
}

class TextArea extends React.PureComponent<Props, State> {
  public state: State = {
    dirty: false,
    value: this.initialValue,
  }

  get initialValue(): string {
    // If WidgetStateManager knew a value for this widget, initialize to that.
    // Otherwise, use the default value from the widget protobuf.
    const widgetId: string = this.props.element.id
    const storedValue = this.props.widgetMgr.getStringValue(widgetId)
    return storedValue !== undefined ? storedValue : this.props.element.default
  }

  public componentDidMount(): void {
    this.setWidgetValue({ fromUi: false })
  }

  private setWidgetValue = (source: Source): void => {
    const widgetId = this.props.element.id
    this.props.widgetMgr.setStringValue(widgetId, this.state.value, source)
    this.setState({ dirty: false })
  }

  private onBlur = (): void => {
    if (this.state.dirty) {
      this.setWidgetValue({ fromUi: true })
    }
  }

  private onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = e.target
    const { element } = this.props
    const { maxChars } = element

    if (!maxChars || value.length <= maxChars) {
      this.setState({
        dirty: true,
        value,
      })
    }
  }

  isEnterKeyPressed = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): boolean => {
    const { keyCode, key } = event

    // Using keyCode as well due to some different behaviors on Windows
    // https://bugs.chromium.org/p/chromium/issues/detail?id=79407
    return key === "Enter" || keyCode === 13 || keyCode === 10
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    const { metaKey, ctrlKey } = e
    const { dirty } = this.state

    if (this.isEnterKeyPressed(e) && (ctrlKey || metaKey) && dirty) {
      e.preventDefault()

      this.setWidgetValue({ fromUi: true })
    }
  }

  public render = (): React.ReactNode => {
    const { element, disabled, width } = this.props
    const { value, dirty } = this.state

    const style = { width }
    const { height } = element

    return (
      <div className="stTextArea" style={style}>
        <StyledWidgetLabel>{element.label}</StyledWidgetLabel>
        {element.help && (
          <StyledWidgetLabelHelp>
            <TooltipIcon
              content={element.help}
              placement={Placement.TOP_RIGHT}
            />
          </StyledWidgetLabelHelp>
        )}
        <UITextArea
          value={value}
          onBlur={this.onBlur}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          disabled={disabled}
          overrides={{
            Input: {
              style: {
                height: height ? `${height}px` : "",
                minHeight: "95px",
                resize: height ? "vertical" : "none",
              },
            },
          }}
        />
        <InputInstructions
          dirty={dirty}
          value={value}
          maxLength={element.maxChars}
          type={"multiline"}
        />
      </div>
    )
  }
}

export default TextArea
