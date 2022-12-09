import { NodeData, Node, Bounds, Point, Size, IViewModel, IViewNode, ViewNodeChangeListener, ViewNodeChangeEventType, ViewNodeChangeEvent, EdgeConnectorType, IEdge } from "./types";
import * as utils from './utils';
import { NODE_ID_ATTR, NICE_DAG_NODE_CLS } from './constants';

export default class ViewNode implements IViewNode {

    joint?: boolean;
    editing?: boolean;
    dependencies?: string[];
    id: string;
    data?: NodeData;
    children?: Node[];
    parentId?: string;
    collapse?: boolean;
    x: number;
    y: number;
    width: number;
    height: number;
    listeners: ViewNodeChangeListener[] = [];
    ref: HTMLElement;
    edgeConnectorType: EdgeConnectorType;
    readonly model: IViewModel;

    constructor(node: Node, joint: boolean, model: IViewModel, edgeConnectorType?: EdgeConnectorType) {
        this.model = model;
        this.id = node.id;
        this.joint = joint;
        this.data = node.data;
        this.parentId = node.parentId;
        this.children = node.children;
        this.dependencies = node.dependencies || [];
        this.edgeConnectorType = edgeConnectorType;
        this.collapse = node.collapse;
        this.ref = utils.createElement().withClassNames(NICE_DAG_NODE_CLS).withAttributes({
            [`${NODE_ID_ATTR}`]: node.id
        }).htmlElement;
    }

    resize(size: Size): void {
        this.width = size.width;
        this.height = size.height;
        this.doLayout();
        this.fireNodeChange({ type: ViewNodeChangeEventType.RESIZE, node: this });
    }

    addChildNode(node: Node, point: Point): Node {
        const isCollapsed = this.collapse || !this.children || this.children.length === 0;
        if (!this.children) {
            this.children = [];
        }
        this.children.push(node);
        this.fireNodeChange({
            type: ViewNodeChangeEventType.ADD_CHILD_NODE, node: this, data: {
                point,
                isCollapsed,
                sourceNode: node
            }
        });
        return this.model.findNodeById(node.id);
    }

    removeDependency(node: IViewNode): boolean {
        const exists = this.dependencies.some(dependency => dependency === node.id);
        this.dependencies = this.dependencies.filter(dependency => dependency !== node.id);
        return exists;
    }

    connect(node: IViewNode): void {
        if (!node?.dependencies.some(dependency => dependency === this.id)) {
            if (!node.dependencies) {
                node.dependencies = [];
            }
            node.dependencies.push(this.id);
            this.model.addEdge(this, node);
        }
    }

    findConnected(runAfter: boolean = false): Node[] {
        if (!runAfter) {
            return this.model.findNodesByDependencies(this.dependencies);
        }
        return this.model.findNodesByPrecedentNodeId(this.id);
    }

    findEdgesAsSource(): IEdge[] {
        return this.model.findEdgesBySourceId(this.id);
    }
    findEdgesAsTarget(): IEdge[] {
        return this.model.findEdgesByTargetId(this.id);
    }

    doLayout(): void {
        utils.editHtmlElement(this.ref).withAbsolutePosition({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        });
    }

    setPoint(point: Point, fireNodeChange: boolean = true): void {
        this.x = point.x;
        this.y = point.y;
        if (this.ref) {
            this.ref.style.left = `${this.x}px`;
            this.ref.style.top = `${this.y}px`;
        }
        if (fireNodeChange) {
            this.fireNodeChange({ type: ViewNodeChangeEventType.POSITION_CHANGE, node: this });
        }
    }

    setBounds(bounds: Bounds, fireChangeEvent?: boolean) {
        this.x = bounds.x;
        this.y = bounds.y;
        this.width = bounds.width;
        this.height = bounds.height;
        if (this.ref) {
            //todo: yufei, check if equals
            this.ref.style.left = `${this.x}px`;
            this.ref.style.top = `${this.y}px`;
            this.ref.style.width = `${this.width}px`;
            this.ref.style.height = `${this.height}px`;
        }
        if (fireChangeEvent) {
            this.fireNodeChange({ type: ViewNodeChangeEventType.POSITION_CHANGE, node: this });
        }
    }

    shrink(): void {
        this.collapse = true;
        this.fireNodeChange({ type: ViewNodeChangeEventType.SHRINK_NODE, node: this });
    }

    expand(): void {
        this.collapse = false;
        this.fireNodeChange({ type: ViewNodeChangeEventType.EXPAND_NODE, node: this });
    }

    withChildren(promise: Promise<Node[]>, useCache: boolean = true): void {
        if (this.children && useCache) {
            this.expand();
        } else {
            promise.then(res => {
                this.children = res;
                this.expand();
            });
        }
    }

    refresh(): void {
    }

    remove(): void {
        this.ref?.remove();
        this.fireNodeChange({ type: ViewNodeChangeEventType.REMOVED, node: this });
        this.destory();
    }

    addNodeChangeListener = (listener: ViewNodeChangeListener): void => {
        if (!this.listeners.some(l => l === listener)) {
            this.listeners.push(listener);
        }
    }

    removeNodeChangeListener = (listener: ViewNodeChangeListener): void => {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    public fireNodeChange = (e: ViewNodeChangeEvent): void => {
        this.listeners.forEach(listener => {
            listener.onNodeChange(e);
        });
    }

    destory() {
        this.listeners = [];
        this.ref = null;
    }

}