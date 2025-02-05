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

import React, { PureComponent, ReactNode } from "react"
import { TimeInput as TimeInputProto } from "autogen/proto"
import { TimePicker as UITimePicker } from "baseui/timepicker"
import { WidgetStateManager, Source } from "lib/WidgetStateManager"
import {
  StyledWidgetLabel,
  StyledWidgetLabelHelp,
} from "components/widgets/BaseWidget"
import TooltipIcon from "components/shared/TooltipIcon"
import { Placement } from "components/shared/Tooltip"

export interface Props {
  disabled: boolean
  element: TimeInputProto
  widgetMgr: WidgetStateManager
  width: number
}

interface State {
  /**
   * The value specified by the user via the UI. If the user didn't touch this
   * widget's UI, the default value is used.
   */
  value: string
}

class TimeInput extends PureComponent<Props, State> {
  public state: State = {
    value: this.initialValue,
  }

  get initialValue(): string {
    // If WidgetStateManager knew a value for this widget, initialize to that.
    // Otherwise, use the default value from the widget protobuf.
    const widgetId = this.props.element.id
    const storedValue = this.props.widgetMgr.getStringValue(widgetId)
    return storedValue !== undefined ? storedValue : this.props.element.default
  }

  public componentDidMount(): void {
    this.setWidgetValue({ fromUi: false })
  }

  private setWidgetValue = (source: Source): void => {
    const widgetId = this.props.element.id
    this.props.widgetMgr.setStringValue(widgetId, this.state.value, source)
  }

  private handleChange = (newDate: Date): void => {
    const value = this.dateToString(newDate)
    this.setState({ value }, () => this.setWidgetValue({ fromUi: true }))
  }

  private stringToDate = (value: string): Date => {
    const [hours, minutes] = value.split(":").map(Number)
    const date = new Date()

    date.setHours(hours)
    date.setMinutes(minutes)

    return date
  }

  private dateToString = (value: Date): string => {
    const hours = value
      .getHours()
      .toString()
      .padStart(2, "0")
    const minutes = value
      .getMinutes()
      .toString()
      .padStart(2, "0")

    return `${hours}:${minutes}`
  }

  public render = (): ReactNode => {
    const { disabled, width, element } = this.props
    const style = { width }

    const selectOverrides = {
      Select: {
        props: {
          disabled,
        },
      },
    }

    return (
      <div className="stTimeInput" style={style}>
        <StyledWidgetLabel>{element.label}</StyledWidgetLabel>
        {element.help && (
          <StyledWidgetLabelHelp>
            <TooltipIcon
              content={element.help}
              placement={Placement.TOP_RIGHT}
            />
          </StyledWidgetLabelHelp>
        )}
        <UITimePicker
          format="24"
          value={this.stringToDate(this.state.value)}
          onChange={this.handleChange}
          overrides={selectOverrides}
          creatable
        />
      </div>
    )
  }
}

export default TimeInput
