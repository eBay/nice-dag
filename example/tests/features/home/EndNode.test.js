import React from 'react';
import { shallow } from 'enzyme';
import { EndNode } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EndNode />);
  expect(renderedComponent.find('.home-end-node').length).toBe(1);
});
