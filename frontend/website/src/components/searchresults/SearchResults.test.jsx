import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import { Card, CardContent } from '@material-ui/core';

import { SearchResults } from './SearchResults';

const mockSearchResults = [
  {
      "ID": 22,
      "CreatedAt": "2020-06-26T07:51:48.306436Z",
      "UpdatedAt": "2020-06-26T07:51:48.306436Z",
      "SerialNumber": "CH-1",
      "Brand": "Starbucks",
      "Status": "New",
      "Model": "Cup",
      "DateBought": "Today"
  },
  {
      "ID": 25,
      "CreatedAt": "2020-06-26T07:52:29.048139Z",
      "UpdatedAt": "2020-06-26T07:52:29.048139Z",
      "SerialNumber": "CH-2",
      "Brand": "CBTL",
      "Status": "New",
      "Model": "Tumblr",
      "DateBought": "Today"
  }
]

describe("Render Search Result tests",() => {
  test("Compare snapshot test",() => {
    const component = renderer.create(
      <SearchResults searchResults={mockSearchResults}/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test("Check for presence of 2 search result cards",() => {
    const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
    expect(component.find(Card).length).toEqual(2)
  })
  mockSearchResults.forEach((result,idx) => {
    test(`Check for presence of result card with brand name ${result["Brand"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(0).text()).toEqual("Brand: " + result["Brand"])
    })
    test(`Check for presence of result card with model name ${result["Model"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(1).text()).toEqual("Model: " + result["Model"])
    })
    test(`Check for presence of result card with Status name ${result["Status"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(2).text()).toEqual("Status: " + result["Status"])
    })
    test(`Check for presence of result card with Serial Number ${result["SerialNumber"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(3).text()).toEqual("Serial Number: " + result["SerialNumber"])
    })
    test(`Check for presence of result card with Date Bought ${result["DateBought"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(4).text()).toEqual("Date Bought: " + result["DateBought"])
    })
    test(`Check for presence of result card with Updated At ${result["UpdatedAt"]}`,() => {
      const component = shallow(<SearchResults searchResults={mockSearchResults}/>)
      expect(component.find(CardContent).at(idx).childAt(5).text()).toEqual("Updated At: " + result["UpdatedAt"])
    })
  })
})