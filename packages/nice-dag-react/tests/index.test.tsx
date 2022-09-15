import { useNiceDag } from '../src/index';
import { initNodes, mapNodeSize } from './test-utils';
import { renderHook, act } from '@testing-library/react-hooks/dom';

describe('check nodes structure in useNiceDag hook', () => {
  let testInitNodes = initNodes;
  const { result } = renderHook(() => useNiceDag({
    initNodes: testInitNodes, mapNodeSize
  }));
  test('check nodes returned', () => {
    expect(result.current.nodes).toEqual(testInitNodes);
  })
  test('get all editable edges', () => {
    expect(result.current.edges(result.current.nodes).length).toBe(5);
  })
  test('connect', () => {
    act(() => {
      result.current.connect('start', 'end');
    })
    expect(result.current.edges(result.current.nodes).length).toBe(6);
  })
  test('set scale and prettify', () => {
    result.current.setScale(1.7);
    result.current.prettify();
    expect(result.current.nodes).toEqual(testInitNodes);
  })
  test('insert between', () => {
    act(() => {
      result.current.insertBetween('1', 'end', 'newNode');
    })
    expect(result.current.edges(result.current.nodes).length).toBe(6);
    // expect(result.current.getAllNodes().length).toBe(22);
  })
  test('remove', () => {
    result.current.remove('newNode');
    expect(result.current.nodes).not.toContain(node => node.id === 'newNode');
    expect(result.current.edges(result.current.nodes).length).toBe(5);
    // expect(result.current.getAllNodes().length).toBe(22);
  })
  test('removeEdge', () => {
    result.current.removeEdge('start', 'end');
    expect(result.current.edges(result.current.nodes).length).toBe(4);
    // expect(result.current.getAllNodes().length).toBe(22);
  })
  test('clear', () => {
    result.current.clear();
    expect(result.current.dagId).toBeNull;
  })
});