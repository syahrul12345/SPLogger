import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { EditDialog } from './EditDialog';
// Mock the redux state
const selectedAppliance = 
  {
    "ID": 22,
    "CreatedAt": "2020-06-26T07:51:48.306436Z",
    "UpdatedAt": "2020-06-26T07:51:48.306436Z",
    "SerialNumber": "CH-1",
    "Brand": "Starbucks",
    "Status": "New",
    "Model": "Cup",
    "DateBought": "Today"
  }

// Define the tests
describe('Render tests for EditDialog', () => {
  test('Comparing snapshot',() => {
    const component = renderer.create(
      <EditDialog selectedAppliance={selectedAppliance}/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test("Checking Serial Number field", () => {
    const component = shallow(<EditDialog selectedAppliance={selectedAppliance}/>)
    expect(component.find("#serialNumber").props().defaultValue).toEqual(selectedAppliance["SerialNumber"])
  })
  test("Checking Brand field", () => {
    const component = shallow(<EditDialog selectedAppliance={selectedAppliance}/>)
    expect(component.find("#brand").props().defaultValue).toEqual(selectedAppliance["Brand"])
  })
  test("Checking Model field", () => {
    const component = shallow(<EditDialog selectedAppliance={selectedAppliance}/>)
    expect(component.find("#model").props().defaultValue).toEqual(selectedAppliance["Model"])
  })
  test("Checking Status field", () => {
    const component = shallow(<EditDialog selectedAppliance={selectedAppliance}/>)
    expect(component.find("#status").props().defaultValue).toEqual(selectedAppliance["Status"])
  })
  test("Date Bought field", () => {
    const component = shallow(<EditDialog selectedAppliance={selectedAppliance}/>)
    expect(component.find("#dateBought").props().defaultValue).toEqual(selectedAppliance["DateBought"])
  })
})