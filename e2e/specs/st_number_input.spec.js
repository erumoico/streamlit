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

describe("st.number_input", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    // Make the ribbon decoration line disappear
    cy.get("[data-testid='stDecoration']").invoke("css", "display", "none");
  });

  it("shows widget correctly", () => {
    cy.get(".stNumberInput").should("have.length", 3);

    cy.get(".stNumberInput").each((el, idx) => {
      // @ts-ignore
      return cy.wrap(el).matchThemedSnapshots("number_input" + idx);
    });
  });

  it("has correct default values", () => {
    cy.get(".stMarkdown").should(
      "have.text",
      'value 1: " 0.0 "' + 'value 2: " 1 "' + 'value 3: " 1 "'
    );
  });

  it("displays instructions correctly on change", () => {
    cy.get(".stNumberInput input")
      .first()
      .clear()
      .type("10");

    cy.get(".stNumberInput")
      .first()
      .matchThemedSnapshots("number_input_change", {
        focus: "input"
      });
  });

  it("sets value correctly on enter keypress", () => {
    cy.get(".stNumberInput input")
      .first()
      .clear()
      .type("10{enter}");

    cy.get(".stMarkdown").should(
      "have.text",
      'value 1: " 10.0 "' + 'value 2: " 1 "' + 'value 3: " 1 "'
    );
  });

  it("sets value correctly on blur", () => {
    cy.get(".stNumberInput input")
      .first()
      .clear()
      .type("10")
      .blur();

    cy.get(".stMarkdown").should(
      "have.text",
      'value 1: " 10.0 "' + 'value 2: " 1 "' + 'value 3: " 1 "'
    );
  });
});
