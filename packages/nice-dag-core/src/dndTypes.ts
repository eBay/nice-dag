import { Bounds, HtmlElementBounds, IViewNode, Point } from "./types";

export interface Grid {
    gridPoint: (p: Point) => Point;
    visible: boolean;
}

export interface Line {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export interface IDndProvider {
    grid: Grid;
    scale: number;
    validDndThreshold?: number;
    svgDndBackground: SVGElement;
    resizeIfNeeded: (size: Bounds) => boolean;
    getParentTopLeft: (node: IViewNode) => Point;
}

export enum XDirection {
    LeftToRight = 'LeftToRight',
    RightToLeft = 'RightToLeft',
    None = 'None'
}

export enum YDirection {
    TopToBottom = 'TopToBottom',
    BottomToTop = 'BottomToTop',
    None = 'None'
}

export interface IDndContext {
    readonly dir: String,
    readonly ratio: number,
    readonly invalidDropping?: boolean;
    readonly provider?: IDndProvider;
    readonly lastBounds: HtmlElementBounds,
    readonly grid: Grid,
    allowDrop: () => boolean;
    moveTo: (mPoint: Point, rootBounds: HtmlElementBounds) => void;
    xDirection: (mPoint: Point, rootBounds: HtmlElementBounds) => XDirection;
    yDirection: (mPoint: Point, rootBounds: HtmlElementBounds) => YDirection;
}

export interface DndInitArgs {
    rootNode: HTMLElement,
    parentNode: HTMLElement,
    viewPortNode: HTMLElement,
    sourceNode: HTMLElement,
    glassStyles?: {
        cursor: string
    },
}

export interface DndContextInitArgs {
    provider?: IDndProvider,
    mPoint: Point,
    ratio: number,
    validDndThreshold?: number;
    bounds: HtmlElementBounds;
}