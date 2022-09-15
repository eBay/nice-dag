import React from 'react';
import { shallow } from 'enzyme';
import { TaskNode } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<TaskNode />);
  expect(renderedComponent.find('.home-task-node').length).toBe(1);
});
