import { IViewNode } from "../types"
import { findEndNodes } from "../utils"

describe('util', () => {
    it('findEndNodes', () => {
        /** empty nodes */
        expect(findEndNodes()).toEqual([])
        /** nodes in tree */
        let mockNodes: IViewNode[] = [
            { id: 'root' },
            { id: 'L1_1', dependencies: [ 'root' ]},
            /** end node */
            { id: 'L1_2', dependencies: [ 'root' ]},
            /** end node */
            { id: 'L2_1', dependencies: [ 'L1_1' ]},
            { id: 'others'}
        ] as IViewNode[]
        expect(findEndNodes(mockNodes)).toEqual([
            { id: 'L1_2', dependencies: [ 'root' ]},
            { id: 'L2_1', dependencies: [ 'L1_1' ]},
            { id: 'others'}
        ])
        /** nodes in cycle */
        mockNodes = [
            { id: '1', dependencies: [ '5' ] },
            { id: '2', dependencies: [ '1' ]},
            { id: '3', dependencies: [ '2' ]},
            { id: '4', dependencies: [ '3' ]},
            { id: '5', dependencies: [ '4' ]}
        ] as IViewNode[]
        expect(findEndNodes(mockNodes)).toEqual([])
    })
})