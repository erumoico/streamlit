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

/**
 * @license
 * Copyright 2019 Streamlit Inc. All rights reserved.
 */

import React, { ReactElement } from "react"
import { useTheme } from "emotion-theming"
import { Theme } from "theme"
import {
  Figure as FigureProto,
  PlotlyChart as PlotlyChartProto,
} from "autogen/proto"
import withFullScreenWrapper from "hocs/withFullScreenWrapper"
import Plot from "react-plotly.js"

export interface PlotlyChartProps {
  width: number
  element: PlotlyChartProto
  height: number | undefined
}

export const DEFAULT_HEIGHT = 450

export function PlotlyChart({
  width: propWidth,
  element,
  height: propHeight,
}: PlotlyChartProps): ReactElement {
  const renderIFrame = (url: string): ReactElement => {
    const height = propHeight || DEFAULT_HEIGHT
    const width = propWidth
    return <iframe title="Plotly" src={url} style={{ width, height }} />
  }

  const isFullScreen = (): boolean => !!propHeight

  const generateSpec = (figure: FigureProto): any => {
    const spec = JSON.parse(figure.spec)

    if (isFullScreen()) {
      spec.layout.width = propWidth
      spec.layout.height = propHeight
    } else if (element.useContainerWidth) {
      spec.layout.width = propWidth
    }

    const theme: Theme = useTheme()
    spec.layout = layoutWithThemeDefaults(spec.layout, theme)

    return spec
  }

  const renderFigure = (figure: FigureProto): ReactElement => {
    const config = JSON.parse(figure.config)
    const { data, layout, frames } = generateSpec(figure)

    return (
      <Plot
        key={isFullScreen() ? "fullscreen" : "original"}
        className="stPlotlyChart"
        data={data}
        layout={layout}
        config={config}
        frames={frames}
      />
    )
  }

  switch (element.chart) {
    case "url":
      return renderIFrame(element.url)
    case "figure":
      return renderFigure(element.figure as FigureProto)
    default:
      throw new Error(`Unrecognized PlotlyChart type: ${element.chart}`)
  }
}

function layoutWithThemeDefaults(layout: any, theme: Theme): any {
  const { colors, genericFonts } = theme

  const themeDefaults = {
    font: {
      color: colors.bodyText,
      family: genericFonts.bodyFont,
    },
    paper_bgcolor: colors.bgColor,
    plot_bgcolor: colors.secondaryBg,
  }

  // Fill in theme defaults where the user didn't specify layout options.
  return {
    ...layout,
    font: {
      ...themeDefaults.font,
      ...layout.font,
    },
    paper_bgcolor: layout.paper_bgcolor || themeDefaults.paper_bgcolor,
    plot_bgcolor: layout.plot_bgcolor || themeDefaults.plot_bgcolor,
  }
}

export default withFullScreenWrapper(PlotlyChart)
