import { HtmlElementBounds, IViewNode } from "../types"
import { findEndNodes, float2Int, getInnerSize, isEmpty, resetBoundsWithRatio, uuid, htmlElementBounds, withDefaultValues, calcAngle, flattenToHirerarchy, getDirection, valueWithDefault } from "../utils"
function mockClientSize(height = 100, width = 100) {
    const originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth')
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: height })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: width })
    return () => {
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', { configurable: true, value: originalClientHeight })
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: originalClientWidth })
    }
}
describe('util', () => {
    it('findEndNodes', () => {
        /** empty nodes */
        expect(findEndNodes()).toEqual([])
        /** nodes in tree */
        let mockNodes: IViewNode[] = [
            { id: 'root' },
            { id: 'L1_1', dependencies: ['root'] },
            /** end node */
            { id: 'L1_2', dependencies: ['root'] },
            /** end node */
            { id: 'L2_1', dependencies: ['L1_1'] },
            { id: 'others' }
        ] as IViewNode[]
        expect(findEndNodes(mockNodes)).toEqual([
            { id: 'L1_2', dependencies: ['root'] },
            { id: 'L2_1', dependencies: ['L1_1'] },
            { id: 'others' }
        ])
        /** nodes in cycle */
        mockNodes = [
            { id: '1', dependencies: ['5'] },
            { id: '2', dependencies: ['1'] },
            { id: '3', dependencies: ['2'] },
            { id: '4', dependencies: ['3'] },
            { id: '5', dependencies: ['4'] }
        ] as IViewNode[]
        expect(findEndNodes(mockNodes)).toEqual([])
    })
    it('getInnerSize', () => {
        const clear = mockClientSize()
        const mockElement = document.createElement('div')
        mockElement.style.padding = "5px 10px"
        mockElement.style.height = "100px"
        document.body.append(mockElement)
        expect(getInnerSize(mockElement)).toEqual({ height: 90, width: 80 })
        clear()
    })
    it('isEmpty', () => {
        expect(isEmpty(null)).toBe(true)
        expect(isEmpty([])).toBe(true)
        expect(isEmpty([1, 2, 3])).toBe(false)
    })
    it('uuid', () => {
        expect(uuid()).not.toBeNull()
    })
    it('float2Int', () => {
        expect(float2Int(2.1234567)).toBe(2)
        expect(float2Int(2.98765432)).toBe(3)
        expect(float2Int(0)).toBe(0)
        expect(float2Int(NaN)).toBe(NaN)
        expect(float2Int(Infinity)).toBe(Infinity)
    })

    it('resetBoundsWithRatio', () => {
        const bounds: HtmlElementBounds = {
            x: 0,
            y: NaN,
            width: 200,
            height: 100,
            top: Infinity,
            left: 10,
        }
        expect(resetBoundsWithRatio(bounds, 0)).toEqual(bounds)
        expect(resetBoundsWithRatio(bounds, 1)).toEqual(bounds)

        expect(resetBoundsWithRatio(bounds, .5)).toEqual({
            x: 0,
            y: NaN,
            top: Infinity,
            left: float2Int(bounds.left / .5),
            width: float2Int(bounds.width / .5),
            height: float2Int(bounds.height / .5),
            bottom: NaN,
            right: NaN,
        })
    })

    it('htmlElementBounds', () => {
        const element = document.createElement('div');
        const rect: DOMRect = element.getBoundingClientRect();
        expect(htmlElementBounds(element)).toEqual({
            x: rect.x,
            y: rect.y,
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height,
        })

    })

    it('withDefaultValues', () => {
        const target = { a: 1 };
        const defaultValues = { b: 2 };
        expect(withDefaultValues(target, defaultValues)).toEqual({
            a: 1,
            b: 2
        })
    })

    it('calcAngle', () => {
        const opposite = 1;
        const adjacent = 1;
        expect(calcAngle(opposite, adjacent)).toEqual(45)
    })

    it('flattenToHirerarchy', () => {
        const flattenNodes = [
            {
                id: 'start',
            },
            {
                id: 'middle',
                dependencies: ['start'],
                data: {
                    label: 'Middle',
                },
            },
            {
                id: 'child',
                data: {
                    label: 'Child',
                },
                parentId: 'middle'
            },
            {
                id: 'end',
                dependencies: ['middle'],
            },
        ];
        expect(flattenToHirerarchy(flattenNodes)[1].children[0].id).toEqual('child')
    })

    it('getDirection', () => {
        const graphLabel = {
            rankdir: 'RL'
        };
        expect(getDirection(graphLabel)).toEqual('RL');
    })

    it('valueWithDefault', () => {
        const value = 'test';
        const defaultValue = 'default';
        expect(valueWithDefault(value, defaultValue)).toEqual('test')
    })
})