import { GraphLabel } from "dagre";
import { getCenter } from "../spaceUtils"
import { Bounds, NiceDagDirection } from "../types"

describe('spaceUtils should work properly', () => {
    it('getCenter', () => {
        const sources: Bounds[] = [
            { x: 0, y: 0, width: 100, height: 100 },
            { x: 0, y: 200, width: 100, height: 100 }
        ];
        const graphLabel: GraphLabel = {
            rankdir: NiceDagDirection.LR
        }
        /** empty nodes */
        expect(getCenter(sources,
            { x: 250, y: 0, width: 100, height: 100 }
            , graphLabel)).toEqual({
                x: 175,
                y: 150
            })
    })
})