import React from 'react';
import { shallow } from 'enzyme';
import { PortConnector } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<PortConnector />);
  expect(renderedComponent.find('.home-port-connector').length).toBe(1);
});
