import { IDndProvider } from './dndTypes';
import { HtmlElementBounds, Point } from './types';
import { XDirection, YDirection } from './dndTypes';

const MOUSE_ACTION_MIN_INTERVAL = 200; //millisecond

interface DndContextInternalInitArgs {
    rootXy: Point;
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
    private rootXy: Point;

    invalidDropping: boolean;
    readonly _provider: IDndProvider;
    readonly dir: String;
    readonly _scale: number;
    readonly validDndThreshold: number;

    constructor({ rootXy, mPoint, bounds, scale, provider }: DndContextInternalInitArgs) {
        this.mouseDownTimestamp = new Date().getTime();
        this.rootXy = rootXy;
        this._scale = scale;
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

    lastBounds(relative: boolean = false): HtmlElementBounds {
        const xyDelta = this.xyDelta;
        const { x, y } = { x: this.originalBounds.left + xyDelta.x, y: this.originalBounds.top + xyDelta.y };
        const _x = !relative ? x : x - this.rootXy.x;
        const _y = !relative ? y : y - this.rootXy.y;
        return {
            ...this.originalBounds,
            x: _x,
            y: _y,
            left: _x,
            top: _y,
            right: _x + this.originalBounds.width,
            bottom: _y + this.originalBounds.height
        }
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