import { paddingWithDefaultValues } from "../defaultInitArgs";

describe('defaultInitArgs should work properly', () => {
    it('paddingWithDefaultValues should return values properly', () => {
        const padding = paddingWithDefaultValues({
            top: 10, bottom: 20
        }, {
            top: 10, bottom: 10, left: 200, right: 300
        });
        expect(padding.top).toEqual(10)
        expect(padding.bottom).toEqual(20)
        expect(padding.left).toEqual(200)
        expect(padding.right).toEqual(300)
    })
})