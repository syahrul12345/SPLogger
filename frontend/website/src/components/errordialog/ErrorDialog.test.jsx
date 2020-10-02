import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import ErrorDialog from "./ErrorDialog";

describe("Render tests for error dialog", () => {
  test("Comapre snapsot", () => {
    const open = false;
    const setOpen = jest.fn();
    const component = renderer.create(
      <ErrorDialog open={open} setOpen={setOpen} errorMessage={"Test error"} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("Check for error message", () => {
    const open = false;
    const setOpen = jest.fn();
    const component = shallow(
      <ErrorDialog open={open} setOpen={setOpen} errorMessage={"Test error"} />
    );
    expect(component.find("#alert-dialog-description").text()).toEqual(
      "Test error"
    );
  });
});
