import {
    Point, Node, NiceDagInitArgs, IViewNode, NiceDagConfig, DagViewConfig, IEdge,
    IReadOnlyNiceDag, StyleObjectType, Size,
    NiceDagModelType,
    NiceDagChangeListener, NiceDag, NiceDagMode,
    IViewModelChangeEvent, ViewModelChangeEventType, ViewModelChangeListener, NiceDagDirection, EdgeConnectorType
} from './types';
import ViewModel from './ViewModel';
import * as utils from './utils';
import * as InitArgs from './defaultInitArgs';
import { NODE_ID_ATTR } from './constants';
import Minimap, { MinimapListener, IMinimapDraggingEvent } from './Minimap';

const DAGGER_MAIN_LAYER_CLS = 'nice-dag-main-layer';
const DAGGER_ZOOM_LAYER_CLS = 'nice-dag-zoom-layer';
const DAGGER_CONTENT_LAYER_CLS = 'nice-dag-content-layer';
const DAGGER_NODES_LAYER_CLS = 'nice-dag-nodes-layer';

const _100_PECTANGLE_SIZE_STYLE = {
    position: 'relative',
    height: '100%',
    width: '100%'
};

function withDefaultValues(args: NiceDagInitArgs): NiceDagInitArgs {
    const graphLabel = InitArgs.graphLabelWithDefaultValues(args.graphLabel);
    const subViewPadding = InitArgs.paddingWithDefaultValues(args.subViewPadding, InitArgs.DEFAULT_SUBVIEW_PADDING);
    const rootViewPadding = InitArgs.paddingWithDefaultValues(args.rootViewPadding, InitArgs.ZERO_PADDING);
    return {
        ...args,
        getEdgeAttributes: args.getEdgeAttributes || InitArgs.getDefaultEdgesAttributes,
        graphLabel,
        mode: args.mode || NiceDagMode.WITH_JOINT_NODES,
        subViewPadding,
        rootViewPadding,
        gridConfig: utils.withDefaultValues(args.gridConfig, InitArgs.DEFAULT_GRID_CONFIG),
        edgeConnectorType: args.edgeConnectorType || EdgeConnectorType.CENTER_OF_BORDER,
        jointEdgeConnectorType: args.jointEdgeConnectorType || EdgeConnectorType.CENTER,
    }
}

export type ViewChangeCallback = () => void;

class DagView implements ViewModelChangeListener {

    /**
     * The nodes layer is used to present nice-dag-node elements
     */
    private nodesLayer: HTMLElement;
    private contentLayer: HTMLElement;
    /**
     * The nodes layer is used to present egdges
     */
    private svgLayer: SVGElement;
    /**
     * View config object
     */
    private viewConfig: DagViewConfig;
    /**
     * List of sub views
     */
    private subViews: DagView[];
    /**
     * View model given by constructor
     */
    model: ViewModel;

    constructor({ viewConfig, model }: { viewConfig: DagViewConfig, model: ViewModel }) {
        this.viewConfig = viewConfig;
        this.model = model;
        this.model.addModelChangeListener(this);
        this.subViews = this.model.childVMs?.map(vm => new DagView({ viewConfig, model: vm }));
    }

    private appendNode = (vNode: IViewNode): void => {
        this.nodesLayer.appendChild(vNode.ref);
        if (this.viewConfig.mapNodeToElement) {
            vNode.ref.appendChild(this.viewConfig.mapNodeToElement(vNode));
        }
    }

    getContentElement = (): HTMLElement => {
        return this.contentLayer;
    }

    getEdgeLabel = (sourceId: string, targetId: string): HTMLElement => {
        throw new Error(`Can't support the method with ${sourceId}, ${targetId}`);
    }

    private renderEdge = (edge: IEdge): void => {
        const element: SVGElement = edge.pathRef;
        const attributes = this.viewConfig.getEdgeAttributes(edge);
        const pathSvgElement = utils.editHtmlElement(element).withAttributes({
            'stroke': attributes && attributes.color ? attributes.color : 'rgb(204, 204, 204)' //todo:conside constant
        }).svgElement;
        if (!attributes.hideArrow) {
            pathSvgElement.setAttribute('marker-mid', `url(#${this.model.dagId}-nice-dag-svg-arrow)`);
        }
    }

    getNodeLayerSizeStyle = (): StyleObjectType => {
        const size = this.model.size(false);
        return {
            'position': 'relative',
            'width': `${size.width}px`,
            'height': `${size.height}px`,
            'z-index': '1'
        };
    }

    justifySize(size: Size): void {
        if (size.width > 0) {
            this.nodesLayer.style.width = `${size.width}px`;
            this.contentLayer.style.width = `${size.width}px`;
        }
        if (size.height > 0) {
            this.nodesLayer.style.height = `${size.height}px`;
            this.contentLayer.style.height = `${size.height}px`;
        }
    }

    getContentLayerStyle = (): StyleObjectType => {
        const size = this.model.size();
        return {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'height': `${size.height}px`,
            'width': `${size.width}px`,
        };
    }

    render = (parentElement: HTMLElement): void => {
        const padding = this.model.isRoot ? this.viewConfig.rootViewPadding : this.viewConfig.subViewPadding;
        utils.editHtmlElement(parentElement).withStyle({
            'padding-top': `${padding.top}px`,
            'padding-bottom': `${padding.bottom}px`,
            'padding-left': `${padding.left}px`,
            'padding-right': `${padding.right}px`,
        });
        this.nodesLayer = utils.createElement(parentElement).withStyle(this.getNodeLayerSizeStyle()).withClassNames(DAGGER_NODES_LAYER_CLS).htmlElement;
        this.svgLayer = utils.createSvgIfAbsent(this.nodesLayer, null, `${this.model.dagId}-nice-dag-svg-arrow`).withAttributes(
            {
                'width': '100%',
                'height': '100%'
            }
        ).svgElement;
        this.contentLayer = utils.createElement(parentElement).withStyle(this.getContentLayerStyle()).withClassNames(DAGGER_CONTENT_LAYER_CLS).htmlElement;
        this.appendViewElement(this.model.parentNode, this.contentLayer);
        const subViewContainers: Record<string, HTMLElement> = {};
        this.model.nodes.forEach(node => {
            this.appendNode(node);
            if (!utils.isEmpty(node.children) && !node.collapse) {
                subViewContainers[node.id] = node.ref;
                node.ref.setAttribute('data-subview-key', 'true');
            }
        });
        this.model.edges.forEach(edge => {
            this.svgLayer.appendChild(edge.pathRef);
            this.nodesLayer.appendChild(edge.ref);
            this.renderEdge(edge);
        });
        if (!utils.isEmpty(this.subViews)) {
            this.subViews.forEach(subView => {
                subView.render(subViewContainers[subView.model.id]);
            });
        }
    }

    appendViewElement = (node: Node, contentLayer: HTMLElement) => {
        if (this.viewConfig.getViewElement) {
            const viewElement = this.viewConfig.getViewElement(node);
            if (viewElement) {
                contentLayer.appendChild(viewElement);
            }
        }
    }

    resize = (): void => {
        utils.editHtmlElement(this.nodesLayer).withStyle(this.getNodeLayerSizeStyle());
        utils.editHtmlElement(this.contentLayer).withStyle(this.getContentLayerStyle());
    }

    destory = (): void => {
        this.clear();
        this.model.removeNodeChangeListener(this);
    }

    clear(): void {
        /**
         * Clear padding of the nice-dag-node
         */
        utils.editHtmlElement(this.nodesLayer.parentElement).withStyle({
            'padding-top': 0,
            'padding-bottom': 0,
            'padding-left': 0,
            'padding-right': 0,
        });
        this.nodesLayer?.remove();
        this.contentLayer?.remove();
    }

    onModelChange(event: IViewModelChangeEvent): void {
        if (event.type === ViewModelChangeEventType.REMOVE_SUB_VIEW) {
            const dirtySubView = this.subViews?.find(subView => subView.model.id === (event.originalSource as IViewNode).id)
            /**
             * For the case of event propogation, the upper layer view can ignore the event if the id doesn't belong to any subview
             */
            dirtySubView.destory();
            this.subViews = this.subViews?.filter(subView => subView.model.id !== `${(event.originalSource as IViewNode).id}`);
        } else if (event.type === ViewModelChangeEventType.ADD_SUB_VIEW) {
            const mapper: Record<string, DagView> = {};
            this.subViews.forEach(subView => mapper[subView.model.id] = subView);
            this.subViews = this.model.childVMs?.map(vm => {
                let subView = mapper[vm.id];
                if (!subView) {
                    const newSubView = new DagView({ viewConfig: this.viewConfig, model: vm });
                    const element = this.nodesLayer.querySelector(`[${NODE_ID_ATTR}='${(event.originalSource as IViewNode).id}']`) as HTMLElement;
                    newSubView.render(element);
                    subView = newSubView;
                }
                return subView;
            });
        } else if (event.type === ViewModelChangeEventType.RESIZE) {
            this.resize();
        } else if (event.type === ViewModelChangeEventType.ADD_EDGE) {
            this.svgLayer.appendChild((event.originalSource as IEdge).pathRef);
            this.nodesLayer.appendChild((event.originalSource as IEdge).ref);
            (event.originalSource as IViewNode).doLayout();
            this.renderEdge(event.originalSource as IEdge);
        } else if (event.type === ViewModelChangeEventType.ADD_NODE) {
            (event.originalSource as IViewNode).doLayout();
            this.nodesLayer.appendChild((event.originalSource as IEdge).ref);
        }
    }

    getAllNodes(): IViewNode[] {
        return this.model.getAllNodes();
    }

    getAllEdges(): IEdge[] {
        return this.model.getAllEdges();
    }
}

export default class ReadOnlyNiceDag implements IReadOnlyNiceDag, ViewModelChangeListener, MinimapListener {

    protected _rootContainer: HTMLElement;
    protected zoomLayer: HTMLElement;
    protected _config: NiceDagConfig;
    protected mainLayer: HTMLElement;
    protected rootView: DagView;
    protected minimap: Minimap;
    protected rootModel: ViewModel;
    protected uid: string;
    private listeners: NiceDagChangeListener[] = [];
    protected parentSize: Size;
    protected _scale: number;
    private useDefaultMapEdgeToPoints: boolean;
    private destoried: boolean;

    constructor(args: NiceDagInitArgs) {
        this.uid = args.id || utils.uuid();
        const { container, minimapContainer, minimapConfig, ...config } = withDefaultValues(args);
        this._config = config;
        this._config.mapEdgeToPoints = args.mapEdgeToPoints;
        if (!this._config.mapEdgeToPoints) {
            this._config.mapEdgeToPoints = InitArgs.mapEdgeToPointsWithDir[this._config.graphLabel.rankdir];
            this.useDefaultMapEdgeToPoints = true;
        }

        this._rootContainer = container;
        this.mainLayer = utils.createElementIfAbsent(this.rootContainer, DAGGER_MAIN_LAYER_CLS).withStyle(
            { ..._100_PECTANGLE_SIZE_STYLE, overflow: 'auto' }
        ).htmlElement;
        this.mainLayer.addEventListener('scroll', this.onMainLayerScroll);
        this.zoomLayer = utils.createElementIfAbsent(this.mainLayer, DAGGER_ZOOM_LAYER_CLS).withStyle(
            {
                'position': 'absolute',
                'z-index': 1,
            }
        ).htmlElement;
        if (minimapContainer) {
            this.minimap = new Minimap({
                mainLayer: this.mainLayer, zoomLayer: this.zoomLayer,
                container: minimapContainer, ...minimapConfig
            });
            this.minimap.addMinimapListener(this);
        }
    }

    getRootContentElement = (): HTMLElement => {
        return this.rootView.getContentElement();
    }

    setDirection(direction: NiceDagDirection): void {
        this._config.graphLabel.rankdir = direction;
        if (this.useDefaultMapEdgeToPoints) {
            this._config.mapEdgeToPoints = InitArgs.mapEdgeToPointsWithDir[this._config.graphLabel.rankdir];
        }
        this.prettify();
    }

    prettify(): void {
        this.rootModel.doLayout(true, true);
        this.justifyCenter(this.parentSize);
        this.fireMinimapChange();
    }

    onMinimapDragging(event: IMinimapDraggingEvent): void {
        const { scrollLeft, scrollTop } = event;
        this.mainLayer.scrollTop = scrollTop;
        this.mainLayer.scrollLeft = scrollLeft;
    }

    onModelChange(event: IViewModelChangeEvent): void {
        if (event.type === ViewModelChangeEventType.RESIZE) {
            utils.editHtmlElement(this.zoomLayer).withSize(this.rootView.model.size());
        }
        if (event.type === ViewModelChangeEventType.RESIZE
            || event.type === ViewModelChangeEventType.ADD_SUB_VIEW
            || event.type === ViewModelChangeEventType.REMOVE_SUB_VIEW) {
            this.justifyCenter(this.parentSize);
        }
    }

    get config(): NiceDagConfig {
        return this._config;
    }

    get rootContainer(): HTMLElement {
        return this._rootContainer;
    }

    get id(): string {
        return this.uid;
    }

    center(size: Size): NiceDag {
        this.parentSize = size;
        this.justifyCenter(this.parentSize);
        this.fireMinimapChange();
        return this;
    }

    justifyCenter(size: Size): void {
        if (size) {
            const zoomLayerBounds = this.zoomLayer.getBoundingClientRect();
            let offsetX: number = 0;
            let offsetY: number = 0;
            if (size.width > zoomLayerBounds.width) {
                offsetX = (size.width - zoomLayerBounds.width) / 2;
            }
            if (size.height > zoomLayerBounds.height) {
                offsetY = (size.height - zoomLayerBounds.height) / 2;
            }
            this.zoomLayer.style.left = `${offsetX}px`;
            this.zoomLayer.style.top = `${offsetY}px`;
        }
    }

    withNodes(nodes: Node[]): NiceDag {
        this.rootModel?.destory();
        if (!this.destoried) {
            this.rootView?.clear();
            this.minimap?.clear();
        } else {
            this.minimap?.addMinimapListener(this);
        }
        const hirerarchyNodes = this.config.modelType === NiceDagModelType.FLATTEN ? utils.flattenToHirerarchy(nodes) : nodes;
        /**
         * deep clone,due to the joint node will change dependencies
         */
        const _nodes = JSON.parse(JSON.stringify(hirerarchyNodes));
        this.rootModel = new ViewModel({
            dagId: this.uid, parentNode: {
                id: 'root'
            }, nodes: _nodes, vmConfig: this.config, isRootModel: true
        });
        this.rootView = new DagView({
            model: this.rootModel,
            viewConfig: this.config
        });
        this.rootModel.addModelChangeListener(this);
        this.destoried = false;
        return this;
    }

    findNodeById = (id: string): IViewNode => {
        return this.rootModel.findNodeById(id);
    }

    getElementByNodeId = (id: string): HTMLElement => {
        let element: HTMLElement = this.zoomLayer.querySelector(`[${NODE_ID_ATTR}='${id}']>.${DAGGER_CONTENT_LAYER_CLS}`);
        if (!element) {
            element = this.zoomLayer.querySelector(`[${NODE_ID_ATTR}='${id}']`);
        }
        return element;
    };

    getEdgeLabel = (sourceId: string, targetId: string): HTMLElement => {
        return this.rootView.getEdgeLabel(sourceId, targetId);
    }

    getAllNodes(): IViewNode[] {
        return this.rootView.getAllNodes();
    }

    getAllEdges(): IEdge[] {
        return this.rootView.getAllEdges();
    }

    scrollTo = (id: string) => {
        const element = this.getElementByNodeId(id);
        const parentRect = this.rootContainer.getBoundingClientRect();
        if (element) {
            const rect = element.getBoundingClientRect();
            this.mainLayer.scrollTop += (rect.y - parentRect.y - parentRect.height / 2);
            this.mainLayer.scrollLeft += rect.x - parentRect.x;
        }
    }

    getScrollPosition = (): Point => {
        return {
            x: this.mainLayer.scrollLeft,
            y: this.mainLayer.scrollTop
        }
    }

    render(): void {
        this.rootView.render(this.zoomLayer);
        this.minimap?.render();
        utils.editHtmlElement(this.zoomLayer).withAbsolutePosition(
            {
                x: 0,
                y: 0,
                ...this.rootView.model.size()
            }
        );
        if (this.parentSize) {
            this.justifyCenter(this.parentSize);
        }
    }

    get isDestoried() {
        return this.destoried;
    }

    destory(): void {
        this.destoried = true;
        this.listeners = [];
        this.rootView.destory();
        this.minimap?.destory();
    }

    setScale(scale: number): void {
        this._scale = scale;
        this.zoomLayer.style.transform = `scale(${scale})`;
        this.zoomLayer.style.transformOrigin = `left top`;
        this.zoomLayer.setAttribute('data-zoom-ratio-key', `${scale}`);
        if (this.parentSize) {
            this.justifyCenter(this.parentSize);
        }
        if (this.minimap) {
            this.minimap.setViewBoxScale(scale);
        }
    }

    get scale(): number {
        return this._scale || 1;
    }

    fireNiceDagChange = (): void => {
        this.listeners.forEach(listener => listener.onChange());
        this.fireMinimapChange();
    }

    fireMinimapChange = (): void => {
        this.minimap?.render();
    }

    addNiceDagChangeListener = (listener: NiceDagChangeListener): boolean => {
        if (this.listeners.every(l => l !== listener)) {
            this.listeners.push(listener);
        }
        return false;
    }

    removeNiceDagChangeListener = (listener: NiceDagChangeListener): boolean => {
        if (this.listeners.some(l => l === listener)) {
            this.listeners = this.listeners.filter(l => l === listener);
        }
        return false;
    }

    private onMainLayerScroll = (): void => {
        this.minimap?.updateViewBoxPosition();
    }
}