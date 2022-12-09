import ReadOnlyNiceDag from "./ReadOnlyNiceDag";
import { Grid, Line, IDndProvider } from './dndTypes';
import {
    Bounds, NiceDagInitArgs, NiceDag, HtmlElementBounds,
    Point, Size, IWritableNiceDag, Node,
    IViewModelChangeEvent, ViewModelChangeEventType, ViewModelChangeListener, IViewNode, StyleObjectType
} from './types';
import NiceDagDnd from './dnd';
import * as utils from './utils';
import DndContext from "./dndContext";
import { resetBoundsWithRatio } from "./utils";
import { EDITOR_BKG_CLS, SVG_BKG_ARROW_ID, SVG_BKG_CLS, SVG_DND_ARROW_ID, SVG_DND_CLS, ZERO_BOUNDS } from "./constants";
import ViewModel from "./ViewModel";

const SVGNS = "http://www.w3.org/2000/svg";

class NiceDagGrid implements Grid {
    private readonly gridSize: number;
    private readonly svg: SVGElement;
    private _scale: number;
    private _xArr: number[];
    private _yArr: number[];
    private xLines: SVGElement[] = [];
    private yLines: SVGElement[] = [];
    private _visible: boolean;

    constructor(svg: SVGElement, gridSize: number, _scale: number) {
        this.gridSize = gridSize;
        this.svg = svg;
        this._scale = _scale || 1;
        this._visible = false;
    }

    get visible(): boolean {
        return this._visible;
    }

    clear() {
        this.svg.innerHTML = '';
        this.xLines = [];
        this.yLines = [];
    }

    doLayout = (): void => {
        const parentBounds = this.svg.getBoundingClientRect();
        const bounds = resetBoundsWithRatio(parentBounds, this._scale || 1);
        this._xArr = [];
        for (let v = 0; v <= bounds.width;) {
            this._xArr.push(v);
            v += this.gridSize;
        }
        this._yArr = [];
        for (let v = 0; v <= bounds.height;) {
            this._yArr.push(v);
            v += this.gridSize;
        }
    }

    private getLines = (isYAxis = false): Line[] => {
        const parentBounds = this.svg.getBoundingClientRect();
        const _bounds = resetBoundsWithRatio(parentBounds, this._scale || 1);
        const points: number[] = isYAxis ? this._yArr : this._xArr;
        const lines = points.map((value) => {
            if (isYAxis) {
                return {
                    x1: 0,
                    y1: value,
                    x2: _bounds.width,
                    y2: value,
                };
            }
            return {
                x1: value,
                y1: 0,
                x2: value,
                y2: _bounds.height,
            };
        });
        return lines;
    }

    get xArr(): number[] {
        return this._xArr;
    }

    get yArr(): number[] {
        return this._yArr;
    }

    /**
     * Return row, column
     * @param p point in Global Coordinate System
     * @returns {row, column}
     */
    gridPoint = (p: Point): Point => {
        const parentBounds = this.svg.getBoundingClientRect();
        const point = {
            x: utils.float2Int(p.x / this.scale),
            y: utils.float2Int(p.y / this.scale)
        }
        const pBounds = resetBoundsWithRatio(parentBounds, this.scale);
        const { xArr, yArr } = this;
        const location = { column: -1, row: -1 };
        if (point.x >= pBounds.left + xArr[0]) {
            for (let i = 0; i < xArr.length; i++) {
                if (point.x < pBounds.left + xArr[i]) {
                    location.column = i - 1;
                    break;
                }
            }
            if (location.column === -1) {
                location.column = xArr.length - 2;
            }
            if (location.column > xArr.length - 2) {
                location.column = xArr.length - 2;
            }
        }
        if (point.y >= pBounds.top + yArr[0]) {
            for (let i = 0; i < yArr.length; i++) {
                if (point.y < pBounds.top + yArr[i]) {
                    location.row = i - 1;
                    break;
                }
            }
            if (location.row === -1) {
                location.row = yArr.length - 2;
            }
            if (location.row > yArr.length - 2) {
                location.row = yArr.length - 2;
            }
        }
        if (location.column >= 0 && location.row >= 0) {
            return {
                x: xArr[location.column] + parentBounds.left,
                y: yArr[location.row] + parentBounds.top
            };
        }
        return {
            x: parentBounds.left, y: parentBounds.top
        };
    }

    appendLine(line: Line, isYAxis: boolean): void {
        const lineSvg = document.createElementNS(SVGNS, "line");
        lineSvg.setAttribute("class", 'nice-dag-dnd-svg-layer-dash-line');
        lineSvg.setAttribute("x1", `${line.x1}`);
        lineSvg.setAttribute("x2", `${line.x2}`);
        lineSvg.setAttribute("y1", `${line.y1}`);
        lineSvg.setAttribute("y2", `${line.y2}`);
        utils.editHtmlElement(lineSvg).withAttributes({
            'stroke': '#9a9a9a',
            'stroke-width': 1,
            'stroke-dasharray': '2, 4',
        });
        if (!isYAxis) {
            this.xLines.push(lineSvg);
        } else {
            this.yLines.push(lineSvg);
        }
        this.svg.appendChild(lineSvg);
    }

    redraw() {
        const { xArr, yArr } = this;
        this.doLayout();
        const xLines = this.getLines();
        if (this._xArr.length > xArr.length) {
            for (let i = 0; i < this._xArr.length; i++) {
                const line = xLines[i];
                if (i >= xArr.length) {
                    this.appendLine(line, false);
                }
            }
        }
        for (let i = 0; i < xLines.length; i++) {
            const line = xLines[i];
            utils.editHtmlElement(this.xLines[i]).withAttributes({
                'x1': `${line.x1}`,
                'x2': `${line.x2}`,
                'y1': `${line.y1}`,
                'y2': `${line.y2}`,
            });
        }
        const yLines = this.getLines(true);
        if (this._yArr.length > yArr.length) {
            for (let i = 0; i < this._yArr.length; i++) {
                const line = yLines[i];
                if (i >= yArr.length) {
                    this.appendLine(line, true);
                }
            }
        }
        for (let i = 0; i < yLines.length; i++) {
            const line = yLines[i];
            utils.editHtmlElement(this.yLines[i]).withAttributes({
                'x1': `${line.x1}`,
                'x2': `${line.x2}`,
                'y1': `${line.y1}`,
                'y2': `${line.y2}`,
            });
        }
    }

    render = () => {
        this._visible = true;
        this.clear();
        this.doLayout();
        const xLines = this.getLines();
        xLines.forEach(line => {
            this.appendLine(line, false);
        });
        const yLines = this.getLines(true);
        yLines.forEach(line => {
            this.appendLine(line, true);
        });
    }

    set scale(value: number) {
        this._scale = value;
    }
}

export default class WritableNiceDag extends ReadOnlyNiceDag implements IDndProvider, ViewModelChangeListener, IWritableNiceDag {

    private _dnd: NiceDagDnd;
    private _editing: boolean;
    private svgGridBkg: SVGElement;
    private svgDndBkg: SVGElement;
    private editorBkgContainer: HTMLElement;
    private _grid: NiceDagGrid;
    private glassStyles: StyleObjectType;

    constructor(args: NiceDagInitArgs) {
        super(args);
        this._dnd = new NiceDagDnd(this.mainLayer, args.glassStyles, this._config.mapEdgeToPoints);
        this.editorBkgContainer = utils.createElementIfAbsent(this.mainLayer, EDITOR_BKG_CLS).htmlElement;
        this.svgGridBkg = utils.createSvgIfAbsent(this.editorBkgContainer, null, `${this.uid}-${SVG_BKG_ARROW_ID}`)
            .withStyle({
                width: '100%',
                height: '100%'
            })
            .withClassNames(SVG_BKG_CLS).svgElement;
        this.svgDndBkg = utils.createSvgIfAbsent(this.editorBkgContainer, null, `${this.uid}-${SVG_DND_ARROW_ID}`)
            .withClassNames(SVG_DND_CLS)
            .withAbsolutePosition(ZERO_BOUNDS).withStyle({
                width: '100%',
                height: '100%',
                'display': 'none',
                'z-index': 99
            }).svgElement;
    }

    endNodeDragging(): void {
        this.fireMinimapChange();
    }

    endEdgeDragging(): void {
        this.fireMinimapChange();
    }

    get svgDndBackground(): SVGElement {
        return this.svgDndBkg;
    }

    onModelChange(event: IViewModelChangeEvent): void {
        super.onModelChange(event);
        if (event.type === ViewModelChangeEventType.RESIZE) {
            if (this._editing) {
                this.doBackgroundLayout();
                this._grid.redraw();
                this.fireMinimapChange();
            }
        } else if (event.type === ViewModelChangeEventType.REMOVE_NODE) {
            this.fireMinimapChange();
        }
    }

    get grid(): Grid {
        return this._grid;
    }

    get validDndThreshold(): number {
        return 3;
    }

    addJointNode(node: Node, point: Point = {
        x: 0,
        y: 0
    }, targetNodeId: string = 'root'): Node {
        if (targetNodeId === 'root') {
            return this.rootModel.addNode(node, point, true);
        } else {
            const parentNode = this.rootModel.findNodeById(targetNodeId) as IViewNode;
            return parentNode.addChildNode(node, point);
        }
    }

    addNode(node: Node, point: Point = {
        x: 0,
        y: 0
    }, targetNodeId: string = 'root'): Node {
        if (targetNodeId === 'root') {
            return this.rootModel.addNode(node, point);
        } else {
            const parentNode = this.rootModel.findNodeById(targetNodeId) as IViewNode;
            return parentNode.addChildNode(node, point);
        }
    }

    startEditing = (): void => {
        this._editing = true;
        this.getAllNodes().forEach(node => node.editing = true);
        this._dnd.setEnabled(true);
        this.setGridVisible(true);
    }

    stopEditing = (): void => {
        this._editing = false;
        this.getAllNodes().forEach(node => node.editing = false);
        this._dnd.setEnabled(false);
        this.setGridVisible(false);
    }

    withNodes(nodes: Node[]): NiceDag {
        const _destoried = this.isDestoried;
        super.withNodes(nodes);
        if (_destoried) {
            this._dnd = new NiceDagDnd(this.mainLayer, this.glassStyles, this._config.mapEdgeToPoints);
            if (this._editing) {
                this.startEditing();
            } else {
                this.stopEditing();
            }
        }
        return this;
    }

    get editing() {
        return this._editing;
    }

    center(size: Size): NiceDag {
        if (!this._editing) {
            super.center(size);
            this.doBackgroundLayout();
            this.setGridVisible(this._editing);
        }
        return this;
    }

    doBackgroundLayout(): void {
        const zoomLayerBounds = this.zoomLayer.getBoundingClientRect();
        const { scale = 1 } = this;
        /**
         * Reset to ratio 1
         */
        const mainLayerBounds = this.mainLayer.getBoundingClientRect();
        const size = {
            width: utils.float2Int(zoomLayerBounds.width / scale),
            height: utils.float2Int(zoomLayerBounds.height / scale)
        };
        if (zoomLayerBounds.width < mainLayerBounds.width) {
            size.width = utils.float2Int(mainLayerBounds.width / scale);
        }
        if (zoomLayerBounds.height < mainLayerBounds.height) {
            size.height = utils.float2Int(mainLayerBounds.height / scale);
        }
        const bounds = {
            x: 0,
            y: 0,
            ...size
        };
        utils.editHtmlElement(this.editorBkgContainer).withAbsolutePosition(bounds);
    }

    setGridVisible(visible: boolean): void {
        if (visible) {
            this._grid.render();
        } else {
            this._grid.clear();
        }
    }

    prettify(): void {
        const _editing = this.editing;
        this.stopEditing();
        const resized = this.rootModel.doLayout(true, true);
        if (!resized) {
            //justify center is called if resizing needs.
            this.justifyCenter(this.parentSize);
        }
        if (_editing) {
            this.startEditing();
        }
    }

    resizeBackground(parentElement: HTMLElement | SVGElement, bounds: HtmlElementBounds) {
        const backgroundBounds = parentElement.getBoundingClientRect();
        const relativeRight = bounds.x + bounds.width - backgroundBounds.x;
        const relativeBottom = bounds.y + bounds.height - backgroundBounds.y;
        if (backgroundBounds.width < relativeRight) {
            const width = utils.float2Int(relativeRight / (this._scale || 1));
            utils.editHtmlElement(this.svgDndBackground).withWidth(width);
            utils.editHtmlElement(this.svgGridBkg).withWidth(width);
        }
        if (backgroundBounds.height < relativeBottom) {
            const height = utils.float2Int(relativeBottom / (this._scale || 1));
            utils.editHtmlElement(this.svgDndBackground).withHeight(height);
            utils.editHtmlElement(this.svgGridBkg).withHeight(height);
        }
        return backgroundBounds.width < relativeRight || backgroundBounds.height < relativeBottom;
    }

    resizeIfNeeded(globalBounds: Bounds): boolean {
        const ifNeeded = this.resizeBackground(this.svgGridBkg, globalBounds);
        if (ifNeeded) {
            this._grid.redraw();
        }
        return ifNeeded;
    }

    render(): void {
        super.render();
        this.doBackgroundLayout();
        this._grid = new NiceDagGrid(this.svgGridBkg, this.config.gridConfig?.size, this._scale);
        this.setGridVisible(this._editing);
    }

    startEdgeDragging = (node: IViewNode, e: MouseEvent) => {
        if (this._editing) {
            utils.editHtmlElement(this.svgDndBkg).withStyle({
                'display': 'block'
            });
            const rootBounds: HtmlElementBounds = this._rootContainer.getBoundingClientRect();
            const bounds: HtmlElementBounds = node.ref.getBoundingClientRect();
            this._dnd.withContext(new DndContext({
                rootXy: {
                    x: rootBounds.left,
                    y: rootBounds.y
                },
                mPoint: {
                    x: e.pageX,
                    y: e.pageY
                },
                bounds,
                scale: this._scale,
                provider: this
            })).startEdgeDragging(node, e);
        }
    }

    justifyCenter(size: Size): void {
        if (!this._editing && size) {
            const zoomLayerBounds = this.zoomLayer.getBoundingClientRect();
            let offsetX: number = 0;
            let offsetY: number = 0;
            let width: number = 0;
            let height: number = 0;
            if (size.width > zoomLayerBounds.width) {
                offsetX = (size.width - zoomLayerBounds.width) / 2;
                width = utils.float2Int(size.width / this.scale);
            }
            if (size.height > zoomLayerBounds.height) {
                offsetY = (size.height - zoomLayerBounds.height) / 2;
                height = utils.float2Int(size.height / this.scale);
            }
            this.rootView.justifySize({ width, height });
            if (offsetX > 0 || offsetY > 0) {
                (this.rootModel as ViewModel).setRootOffset({
                    offsetX: utils.float2Int(offsetX / this.scale),
                    offsetY: utils.float2Int(offsetY / this.scale)
                });
            }
            this.doBackgroundLayout();
        }
    }

    setScale(scale: number): void {
        super.setScale(scale);
        this.editorBkgContainer.style.transform = `scale(${scale})`;
        this.editorBkgContainer.style.transformOrigin = `left top`;
        this.doBackgroundLayout();
        this._grid.scale = scale;
        if (this.grid.visible) {
            this._grid.redraw();
        }
    }

    startNodeDragging = (node: IViewNode, e: MouseEvent) => {
        if (this._editing) {
            utils.editHtmlElement(this.svgDndBkg).withStyle({
                'display': 'block'
            });
            node.editing = true;
            const rootBounds: HtmlElementBounds = this._rootContainer.getBoundingClientRect();
            const bounds: HtmlElementBounds = node.ref.getBoundingClientRect();
            this._dnd.withContext(new DndContext({
                rootXy: {
                    x: rootBounds.left,
                    y: rootBounds.y
                },
                mPoint: {
                    x: e.pageX,
                    y: e.pageY
                },
                bounds,
                scale: this._scale,
                provider: this
            })).startNodeDragging(node, e);
        }
    }

    getParentTopLeft(node: IViewNode): Point {
        const bounds = node.ref.parentElement.getBoundingClientRect();
        return {
            x: bounds.left,
            y: bounds.top
        }
    }

    destory(): void {
        super.destory();
        this._dnd.destory();
    }
}