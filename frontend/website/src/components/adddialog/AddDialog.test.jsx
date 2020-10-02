import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { FormDialog } from "./AddDialog";

describe("Render tests for add dialog", () => {
  test("Comparing snapshot", () => {
    const component = renderer.create(<FormDialog />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("Find serial number field and type", () => {
    const component = shallow(<FormDialog />);
    component.find("#serialNumber").type("testing");
  });
  test("Find brand field and type", () => {
    const component = shallow(<FormDialog />);
    component.find("#brand").type("testing");
  });
  test("Find model field and type", () => {
    const component = shallow(<FormDialog />);
    component.find("#model").type("testing");
  });
  test("Find status field and type", () => {
    const component = shallow(<FormDialog />);
    component.find("#status").type("testing");
  });
  test("Find Date Bought field and type", () => {
    const component = shallow(<FormDialog />);
    component.find("#dateBought").type("testing");
  });
  test("Find cancel button and click", () => {
    const component = shallow(<FormDialog />);
    component.find("#cancelBtn").simulate("click");
  });
  test("Find confirm button and click", () => {
    const component = shallow(<FormDialog />);
    component.find("#confirmBtn").simulate("click");
  });
});
