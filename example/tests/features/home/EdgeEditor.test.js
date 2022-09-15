import React from 'react';
import { shallow } from 'enzyme';
import { EdgeEditor } from '../../../src/features/home';

it('renders node with correct class name', () => {
  const renderedComponent = shallow(<EdgeEditor />);
  expect(renderedComponent.find('.home-edge-editor').length).toBe(1);
});
