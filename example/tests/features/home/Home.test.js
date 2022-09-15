import React from 'react';
import { shallow } from 'enzyme';
import { Home } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<Home />);
  expect(renderedComponent.find('.home-home').length).toBe(1);
});
