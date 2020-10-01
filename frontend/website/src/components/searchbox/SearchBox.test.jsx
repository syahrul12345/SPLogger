import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { TextField, FormControl,MenuItem} from '@material-ui/core';
import { SearchBox } from './SearchBox';

describe("Render Search tests",() => {
  test("Compare snapshot",() => {
    const component = renderer.create(
      <SearchBox/>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
  test("Test for the presence of 1 search box compoennt ", () => {
    const component = shallow(<SearchBox/>)
    expect(component.find(TextField).length).toEqual(1)
  })
  test("Test for the presence of 1 filter selection dropdown component",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(FormControl).length).toEqual(1)
  })
  test("Test for presence of serial number filter",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(MenuItem).at(0).props().value).toEqual('SerialNumber')
  })
  test("Test for presence of Brand filter",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(MenuItem).at(1).props().value).toEqual('Brand')
  })
  test("Test for presence of Model filter",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(MenuItem).at(2).props().value).toEqual('Model')
  })
  test("Test for presence of Status filter",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(MenuItem).at(3).props().value).toEqual('Status')
  })
  test("Test for presence of DateBought filter",() => {
    const component = shallow(<SearchBox/>)
    expect(component.find(MenuItem).at(4).props().value).toEqual('DateBought')
  })
  
})