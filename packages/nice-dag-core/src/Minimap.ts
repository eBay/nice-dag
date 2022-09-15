import html2canvas from "html2canvas";
import * as utils from './utils';
import { MinimapConfig } from './types';

export type MinimapInitArgs = MinimapConfig & {
    mainLayer: HTMLElement;
    zoomLayer: HTMLElement;
    container: HTMLElement;
}

const GLASS_STYLE = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9999',
    display: 'none',
    'user-select': 'none',
    cursor: 'pointer'
};

const GLASS_NODE_CLS = 'minimap-dnd-glass';

export interface IMinimapDraggingEvent {
    scrollLeft: number;
    scrollTop: number;
}

export interface MinimapListener {
    onMinimapDragging: (event: IMinimapDraggingEvent) => void;
}

export default class Minimap {
    protected scale: number;
    protected viewBoxScale: number;
    protected viewBoxInitX: number;
    protected viewBoxInitY: number;
    protected mainLayer: HTMLElement;
    protected zoomLayer: HTMLElement;
    protected minimapContent: HTMLElement;
    protected viewBoxElm: HTMLElement;
    protected viewBoxClassname: String;
    protected canvas: HTMLCanvasElement;
    private dndGlass: HTMLElement;
    protected initClientX: number;
    protected initClientY: number;
    private listeners: MinimapListener[] = [];
    private parentContainer: HTMLElement;
    private contentContainer: HTMLElement;

    constructor(args: MinimapInitArgs) {
        this.viewBoxScale = 1;
        this.mainLayer = args.mainLayer;
        this.zoomLayer = args.zoomLayer;
        this.parentContainer = args.container;
        this.viewBoxElm = this.createViewBoxElement(args?.viewBoxClassName);
        this.canvas = document.createElement("canvas");
        this.contentContainer = utils.createElement(this.parentContainer).withStyle({
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            'justify-content': 'center',
            'place-content': 'center',
            'align-content': 'center',
            'flex-wrap': 'nowrap',
            'flex-direction': 'column',
            'align-items': 'center'
        }).htmlElement;
        this.minimapContent = this.createMinimapElement(args?.className);
        const dndGlass = utils.createElementIfAbsent(this.mainLayer, GLASS_NODE_CLS).withStyle(GLASS_STYLE);
        dndGlass.htmlElement.addEventListener('mousemove', this.onViewBoxDragging);
        dndGlass.htmlElement.addEventListener('mouseup', this.onViewBoxDraggingEnd);
        this.dndGlass = dndGlass.htmlElement;
    }

    addMinimapListener(listener: MinimapListener): void {
        this.listeners.push(listener);
    }

    createMinimapElement(minimapClassname: string): HTMLElement {
        const minimap = utils.createElement(this.contentContainer).withClassNames('nice-dag-minimap').withStyle({
            position: 'relative',
        }).htmlElement;
        if (minimapClassname) {
            minimap.classList.add(minimapClassname);
        }
        return minimap;
    }

    createViewBoxElement(viewBoxClassname: string): HTMLElement {
        const viewBoxElm = utils.createElement(this.contentContainer).withClassNames('nice-dag-minimap').withStyle({
            position: 'relative'
        }).htmlElement;
        viewBoxElm.classList.add('nice-dag-minimap-viewbox');
        if (viewBoxClassname) {
            viewBoxElm.classList.add(viewBoxClassname);
        }
        viewBoxElm.addEventListener('mousedown', this.startViewBoxDragging);
        return viewBoxElm;
    }

    calcRatio(): void {
        const parentSize = utils.getInnerSize(this.parentContainer);
        const zoomLayer = this.zoomLayer;
        const zoomLayerBounds = zoomLayer.getBoundingClientRect();
        const widthHeightRatio = zoomLayerBounds.width / zoomLayerBounds.height;
        if (widthHeightRatio > 1) {
            this.scale = parentSize.width / zoomLayerBounds.width;
        } else {
            this.scale = parentSize.height / zoomLayerBounds.height;
        }
    }

    useWidth(): boolean {
        const zoomLayer = this.zoomLayer;
        const zoomLayerBounds = zoomLayer.getBoundingClientRect();
        const widthHeightRatio = zoomLayerBounds.width / zoomLayerBounds.height;
        return widthHeightRatio > 1;
    }

    render(): void {
        this.clear();
        this.calcRatio();
        const parentBounds = this.parentContainer.getBoundingClientRect();
        const zoomLayer = this.zoomLayer;
        const canvasWidth = zoomLayer.getBoundingClientRect().width * this.scale;
        const canvasHeight = zoomLayer.getBoundingClientRect().height * this.scale;
        const { viewBoxElm } = this;
        utils.editHtmlElement(viewBoxElm).withStyle({
            display: 'none'
        });
        if (this.useWidth()) {
            this.canvas.style.width = `100%`;
            utils.editHtmlElement(this.minimapContent).withStyle({
                width: '100%',
                height: 'auto'
            });
            this.canvas.style.top = `${utils.float2Int((parentBounds.height - canvasHeight) / 2)}px`;
        } else {
            this.canvas.style.height = `100%`;
            utils.editHtmlElement(this.minimapContent).withStyle({
                width: 'auto',
                height: '100%'
            });
            this.canvas.style.left = `${utils.float2Int((parentBounds.width - canvasWidth) / 2)}px`;
        }
        this.canvas.width = Math.ceil(canvasWidth);
        this.canvas.height = Math.ceil(canvasHeight);
        const timeout = setTimeout(() => {
            window.clearTimeout(timeout);
            html2canvas(zoomLayer,
                {
                    useCORS: true,
                    scale: this.scale,
                    canvas: this.canvas,
                    scrollY: 0,
                    scrollX: 0,
                }
            ).then(this.onCanvasReady);
        }, 50);
    }

    destory(): void {
        this.listeners = [];
        this.clear();
    }

    clear(): void {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private onCanvasReady = (canvas: HTMLCanvasElement): void => {
        const { mainLayer, zoomLayer, viewBoxElm, minimapContent, scale } = this;
        const scrollLeft = mainLayer.scrollLeft;
        const scrollTop = mainLayer.scrollTop;
        const viewBoxWidthRelativeScale = mainLayer.offsetWidth > zoomLayer.offsetWidth ? 1 : mainLayer.offsetWidth / zoomLayer.offsetWidth;
        const viewBoxHeightRelativeScale = mainLayer.offsetHeight > zoomLayer.offsetHeight ? 1 : mainLayer.offsetHeight / zoomLayer.offsetHeight;
        const viewBoxWidth = Math.ceil(canvas.width * viewBoxWidthRelativeScale);
        const viewBoxHeight = Math.ceil(canvas.height * viewBoxHeightRelativeScale);
        const viewBoxLeft = Math.ceil(scrollLeft * scale * viewBoxWidthRelativeScale);
        const viewBoxTop = Math.ceil(scrollTop * scale * viewBoxHeightRelativeScale);
        utils.editHtmlElement(viewBoxElm).withStyle({
            border: '1px red solid',
            position: 'absolute',
            width: `${viewBoxWidth}px`,
            height: `${viewBoxHeight}px`,
            left: `${viewBoxLeft}px`,
            top: `${viewBoxTop}px`,
            cursor: 'pointer',
            zIndex: 999,
            display: 'block'
        });
        minimapContent.appendChild(viewBoxElm);
        minimapContent.appendChild(canvas);
    }

    updateViewBoxPosition = (): void => {
        const scrollLeft = this.mainLayer.scrollLeft;
        const scrollTop = this.mainLayer.scrollTop;
        const maxLeft = this.canvas.width - this.viewBoxElm.offsetWidth;
        const maxTop = this.canvas.height - this.viewBoxElm.offsetHeight;
        /**
         * Calc Left
         */
        let left = this.scale * scrollLeft;
        left = Math.max(0, left);
        left = Math.min(left, maxLeft);

        /**
         * Calc top
         */
        let top = this.scale * scrollTop;
        top = Math.max(0, top);
        top = Math.min(top, maxTop);
        utils.editHtmlElement(this.viewBoxElm).withStyle({
            left: `${Math.ceil(left)}px`,
            top: `${Math.ceil(top)}px`
        });
    }


    setViewBoxScale(viewBoxScale: number): void {
        this.viewBoxScale = viewBoxScale;
        let viewBoxElm = this.viewBoxElm;
        const maxScaleX = this.canvas.width / viewBoxElm.offsetWidth;
        const maxScaleY = this.canvas.height / viewBoxElm.offsetHeight;
        const scaleX = Math.min(1 / viewBoxScale, maxScaleX);
        const scaleY = Math.min(1 / viewBoxScale, maxScaleY);
        viewBoxElm.style.transform = `scale(${scaleX}, ${scaleY})`;
        viewBoxElm.style.transformOrigin = `left top`;
    }

    private startViewBoxDragging = (event: MouseEvent): void => {
        this.initClientX = event.clientX;
        this.initClientY = event.clientY;
        this.viewBoxInitX = this.viewBoxElm.offsetLeft;
        this.viewBoxInitY = this.viewBoxElm.offsetTop;
        utils.editHtmlElement(this.dndGlass).withStyle({
            display: 'block'
        });
    }

    private onViewBoxDragging = (event: MouseEvent): void => {
        const deltaX = event.clientX - this.initClientX;
        const deltaY = event.clientY - this.initClientY;
        const maxLeft = this.canvas.width - this.viewBoxElm.offsetWidth / this.viewBoxScale;
        const maxTop = this.canvas.height - this.viewBoxElm.offsetHeight / this.viewBoxScale;
        let left = this.viewBoxInitX + deltaX;
        let top = this.viewBoxInitY + deltaY;
        left = Math.max(0, left);
        left = Math.min(left, maxLeft);
        top = Math.max(0, top);
        top = Math.min(top, maxTop);
        this.viewBoxElm.style.left = `${Math.ceil(left)}px`;
        this.viewBoxElm.style.top = `${Math.ceil(top)}px`;
        this.listeners.forEach(listener => {
            listener.onMinimapDragging({ scrollLeft: left / this.scale, scrollTop: top / this.scale });
        })
    }

    private onViewBoxDraggingEnd = (): void => {
        utils.editHtmlElement(this.dndGlass).withStyle({
            display: 'none'
        });
    }
}