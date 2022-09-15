import React from 'react';
import { shallow } from 'enzyme';
import { ShowModalButton } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<ShowModalButton />);
  expect(renderedComponent.find('.home-show-modal-button').length).toBe(1);
});
