import { graphLabelWithDefaultValues, paddingWithDefaultValues } from "../defaultInitArgs";

describe('defaultInitArgs should work correctly', () => {
    it('paddingWithDefaultValues should return values correctly', () => {
        const padding = paddingWithDefaultValues({
            top: 10, bottom: 20
        }, {
            top: 10, bottom: 10, left: 200, right: 300
        });
        expect(padding.top).toEqual(10);
        expect(padding.bottom).toEqual(20);
        expect(padding.left).toEqual(200);
        expect(padding.right).toEqual(300);
    })

    it('graphLabelWithDefaultValues should return values correctly',()=>{
        const graphLabelValues = graphLabelWithDefaultValues({
            rankdir:'RL'
        });
        expect(graphLabelValues.rankdir).toEqual('RL');
        expect(graphLabelValues.ranksep).toEqual(60);
        expect(graphLabelValues.edgesep).toEqual(10);
    })
})