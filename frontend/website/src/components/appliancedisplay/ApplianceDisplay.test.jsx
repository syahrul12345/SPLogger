import React from "react";
import renderer from "react-test-renderer";
import { shallow } from "enzyme";

import { ApplianceDisplay } from "./ApplianceDisplay";
import { Card, CardContent, Typography } from "@material-ui/core";

// Mock the redux state
const mockAppliances = [
  {
    ID: 22,
    CreatedAt: "2020-06-26T07:51:48.306436Z",
    UpdatedAt: "2020-06-26T07:51:48.306436Z",
    SerialNumber: "CH-1",
    Brand: "Starbucks",
    Status: "New",
    Model: "Cup",
    DateBought: "Today",
  },
  {
    ID: 25,
    CreatedAt: "2020-06-26T07:52:29.048139Z",
    UpdatedAt: "2020-06-26T07:52:29.048139Z",
    SerialNumber: "CH-2",
    Brand: "CBTL",
    Status: "New",
    Model: "Tumblr",
    DateBought: "Today",
  },
];

// Define the tests
describe("Render tests for ApplianceDispaly", () => {
  test("Comparing snapshot", () => {
    const component = renderer.create(<ApplianceDisplay />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Test with 2 appliance objects as props", () => {
  const component = shallow(<ApplianceDisplay appliances={mockAppliances} />);
  test("Test there are 2 cards present", () => {
    expect(component.find(Card).length).toEqual(2);
  });
  mockAppliances.forEach((mockAppliance, idx) => {
    test(`Find card with Brand field as ${mockAppliance["Brand"]}`, () => {
      expect(
        component.find(Card).at(idx).find(CardContent).childAt(0).text()
      ).toEqual("Brand: " + mockAppliance["Brand"]);
    });
    test(`Find card with Model field as ${mockAppliance["Model"]}`, () => {
      expect(
        component.find(Card).at(idx).find(CardContent).childAt(1).text()
      ).toEqual("Model: " + mockAppliance["Model"]);
    });
    test(`Find card with status as ${mockAppliance["Status"]}`, () => {
      expect(
        component.find(Card).at(idx).find(CardContent).childAt(2).text()
      ).toEqual("Status: " + mockAppliance["Status"]);
    });
    test(`Find card with SerialNumber as ${mockAppliance["SerialNumber"]}`, () => {
      expect(
        component.find(Card).at(idx).find(CardContent).childAt(3).text()
      ).toEqual("SerialNumber: " + mockAppliance["SerialNumber"]);
    });
  });
});
