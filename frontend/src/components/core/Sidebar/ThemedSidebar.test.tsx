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
import { mount } from "lib/test_util"
import lightTheme from "theme/lightTheme"
import ThemedSidebar from "./ThemedSidebar"

describe("ThemedSidebar Component", () => {
  it("should render without crashing", () => {
    const wrapper = mount(<ThemedSidebar />)

    expect(wrapper.find("Sidebar").exists()).toBe(true)
  })

  it("should switch bgColor and secondaryBgColor", () => {
    const wrapper = mount(<ThemedSidebar theme={lightTheme} />)

    const updatedTheme = wrapper.find("Sidebar").prop("theme")

    // @ts-ignore
    expect(updatedTheme.colors.bgColor).toBe(lightTheme.colors.secondaryBg)
    // @ts-ignore
    expect(updatedTheme.inSidebar).toBe(true)
  })
})
