import React from 'react';
import { shallow } from 'enzyme';
import { GroupNode } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<GroupNode />);
  expect(renderedComponent.find('.home-group-node').length).toBe(1);
});
