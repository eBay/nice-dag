import React from 'react';
import { shallow } from 'enzyme';
import { StartEndNode } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<StartEndNode />);
  expect(renderedComponent.find('.home-start-end-node').length).toBe(1);
});
