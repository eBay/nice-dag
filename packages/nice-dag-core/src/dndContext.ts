import { IDndProvider } from './dndTypes';
import { HtmlElementBounds, Point } from './types';
import { XDirection, YDirection } from './dndTypes';
import * as utils from './utils';

const MOUSE_ACTION_MIN_INTERVAL = 200; //millisecond

interface DndContextInternalInitArgs {
    rootXy: Point;
    zoomLayerXy: Point;
    bounds: HtmlElementBounds;
    provider?: IDndProvider;
    mPoint?: Point;
    scale?: number;
}

export default class DndContext {

    private mouseDownTimestamp: number;
    private originalBounds: HtmlElementBounds;
    private _originalPoint: Point;
    private mrPoint: Point;
    private originalOffset: Point;
    private zoomLayerXy: Point;

    invalidDropping: boolean;
    readonly _provider: IDndProvider;
    readonly dir: String;
    readonly _scale: number;
    readonly validDndThreshold: number;

    constructor({ rootXy, zoomLayerXy, mPoint, bounds, scale, provider }: DndContextInternalInitArgs) {
        this.mouseDownTimestamp = new Date().getTime();
        this.zoomLayerXy = zoomLayerXy;
        this._scale = scale || 1;
        const { x, y } = rootXy;
        this._originalPoint = {
            x: (mPoint.x - x),
            y: (mPoint.y - y),
        };
        this.originalBounds = {
            x: bounds.left,
            y: bounds.top,
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
            right: bounds.left + bounds.width,
            bottom: bounds.top + bounds.height
        };
        this.originalOffset = {
            x: this._originalPoint.x - this.originalBounds.x,
            y: this._originalPoint.y - this.originalBounds.y,
        };
        this.mrPoint = this._originalPoint;
        this._provider = provider;
        this.validDndThreshold = provider?.validDndThreshold || 3;
    }

    get originalPoint(): Point {
        return this._originalPoint;
    }

    lastBounds(relative: boolean = false, useOriginal: boolean = false): HtmlElementBounds {
        const xyDelta = this.xyDelta;
        const xDelta = useOriginal ? utils.float2Int(xyDelta.x / this._scale) : xyDelta.x;
        const yDelta = useOriginal ? utils.float2Int(xyDelta.y / this._scale) : xyDelta.y;

        const _originalBounds = useOriginal ? utils.resetBoundsWithRatio(this.originalBounds, this._scale || 1) : this.originalBounds;
        const { x, y } = { x: this.originalBounds.left, y: this.originalBounds.top };
        let _x = !relative ? x : x - this.zoomLayerXy.x;
        _x = useOriginal ? utils.float2Int(_x / this._scale || 1) : _x;
        _x += xDelta;

        let _y = !relative ? y : y - this.zoomLayerXy.y;
        _y = useOriginal ? utils.float2Int(_y / this._scale || 1) : _y;
        _y += yDelta;

        const width = _originalBounds.width;
        const height = _originalBounds.height;
        const _bound = {
            ...this.originalBounds,
            x: _x,
            y: _y,
            left: _x,
            top: _y,
            width,
            height,
            right: _x + width,
            bottom: _y + height
        };
        return _bound;
    }

    /**
     * Relative point to Root
     */
    moveTo = (mPoint: Point, rootXy: HtmlElementBounds) => {
        this.mrPoint = {
            x: (mPoint.x - rootXy.x),
            y: (mPoint.y - rootXy.y),
        };
    }

    get xyDelta() {
        return {
            x: this.mrPoint.x - this._originalPoint.x,
            y: this.mrPoint.y - this._originalPoint.y
        }
    }

    topLeftDelta(point: Point) {
        return {
            x: point.x - (this._originalPoint.x - this.originalOffset.x),
            y: point.y - (this._originalPoint.y - this.originalOffset.y)
        }
    }

    get provider() {
        return this._provider;
    }

    /**
     * Return relative mouse point
     */
    get point() {
        return this.mrPoint;
    }

    /**
     * Get x Direction
     * 1. Convert global point to relative point
     * 2. Compare the relative point with current
     * 
     * @param {mPoint, rootXy} mPoint:Mouse point (Global), rootXy:Current root bounds (Global) 
     * @returns lr|none|rl
     */
    xDirection = (mPoint: Point, rootXy: HtmlElementBounds): XDirection => {
        const x = mPoint.x - rootXy.left;
        const rX = (this.mrPoint || { x: 0 }).x;
        if (rX < x) {
            return XDirection.LeftToRight;
        } else if (rX === x) {
            return XDirection.None;
        }
        return XDirection.RightToLeft;
    }

    yDirection = (mPoint: Point, rootXy: HtmlElementBounds): YDirection => {
        const y = mPoint.y - rootXy.top;
        if ((this.mrPoint || { y: 0 }).y < y) {
            return YDirection.TopToBottom;
        } else if ((this.mrPoint || { y: 0 }).y == y) {
            return YDirection.None;
        }
        return YDirection.BottomToTop;
    }

    allowDrop = () => {
        if (this.mouseDownTimestamp && new Date().getTime() - this.mouseDownTimestamp <= MOUSE_ACTION_MIN_INTERVAL) {
            return false;
        }
        const offset = this.xyDelta;
        if (Math.abs(offset.x) <= 5 && Math.abs(offset.y) <= 5) {
            return false;
        }
        return true;
    }

}