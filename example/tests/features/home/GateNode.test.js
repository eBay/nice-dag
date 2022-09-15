import React from 'react';
import { shallow } from 'enzyme';
import { GateNode } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<GateNode />);
  expect(renderedComponent.find('.home-gate-node').length).toBe(1);
});
