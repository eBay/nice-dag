import {
    ViewModelConfig, Node, Size, NiceDagMode, Point,
    IEdge, IViewNode,
    ViewNodeChangeListener, ViewModelChangeListener, ViewModelChangeEventType, IViewModelChangeEvent,
    IViewModel, ViewNodeChangeEventType, ViewNodeChangeEvent, Padding
} from './types';
import * as utils from './utils';
import ViewNode from './ViewNode';
import Edge from './Edge';
import dagre, { GraphLabel } from 'dagre';
import * as niceDagHolder from './niceDagHolder';

function buildDagre(vNodes: IViewNode[], graphlabel: GraphLabel): dagre.graphlib.Graph {
    const g = new dagre.graphlib.Graph();
    g.setGraph(graphlabel);
    g.setDefaultEdgeLabel(function () {
        return {};
    });
    const nodeMap = {};
    for (let i: number = 0; i < vNodes.length; i++) {
        const node = vNodes[i];
        g.setNode(`${i}`, {
            width: node.width,
            height: node.height
        });
        nodeMap[node.id] = i;
    }
    vNodes.forEach((node) => {
        if (node.dependencies && !utils.isEmpty(node.dependencies)) {
            node.dependencies.filter(Boolean).forEach((depNodeId) => {
                g.setEdge(nodeMap[depNodeId], nodeMap[node.id]);
            });
        }
    });
    dagre.layout(g);
    return g;
}


export default class ViewModel implements IViewModel, ViewNodeChangeListener, ViewModelChangeListener {

    private vNodes: IViewNode[];
    private pChildVMs: ViewModel[];
    private _parentNode: Node;
    private vmConfig: ViewModelConfig;
    private pEdges: IEdge[];
    private pSize: Size;
    private listeners: ViewModelChangeListener[] = [];
    private isRootModel: boolean;
    private _dagId: string;

    constructor({ dagId, parentNode, nodes, vmConfig, isRootModel }: { dagId: string, parentNode: Node, nodes: Node[], vmConfig: ViewModelConfig, isRootModel?: boolean }) {
        const _nodes = nodes;
        this._dagId = dagId;
        this._parentNode = parentNode;
        this.vmConfig = vmConfig;
        this.isRootModel = isRootModel;
        this.pChildVMs = _nodes.filter(node => !node.collapse && !utils.isEmpty(node.children)).map(
            node => {
                return this.createChildVm(node, node.children);
            });
        this.init(_nodes);
    }

    setRootOffset({ offsetX, offsetY }: { offsetX: number; offsetY: number; }) {
        if (this.isRoot) {
            this.vNodes.forEach(node => {
                node.x += offsetX;
                node.y += offsetY;
                node.doLayout();
            });
            this.pEdges.forEach(edge => {
                edge.doLayout();
            });
        } else {
            throw new Error(`Sub model doesn't support the method.`);
        }
    }

    addNodes(nodes: Node[], point: Point, offset: number = 40): IViewNode[] {
        let _offsetY = 0;
        const { getNodeSize } = niceDagHolder.use(this.dagId).config;
        return nodes.map(node => {
            const nodeSize = getNodeSize(node);
            const _point = {
                x: point.x,
                y: point.y + _offsetY
            };
            _offsetY += offset + nodeSize.height;
            return this.addNode(node, _point);
        });
    }

    addNode(node: Node, point: Point, joint?: boolean): IViewNode {
        const viewNode = this.toViewNode(node);
        viewNode.editing = true;
        viewNode.joint = joint;
        const { getNodeSize, jointEdgeConnectorType } = niceDagHolder.use(this.dagId).config;
        if (joint) {
            viewNode.edgeConnectorType = jointEdgeConnectorType;
        }
        this.vNodes.push(viewNode);
        const nodeSize = getNodeSize(viewNode);
        viewNode.width = nodeSize.width;
        viewNode.height = nodeSize.height;
        viewNode.x = point.x;
        viewNode.y = point.y;
        this.fireModelChange({
            source: this,
            originalSource: viewNode,
            type: ViewModelChangeEventType.ADD_NODE
        });
        if (!node.collapse && !utils.isEmpty(node.children)) {
            viewNode.expand();
        } else {
            viewNode.fireNodeChange({ type: ViewNodeChangeEventType.POSITION_CHANGE, node: viewNode });
            niceDagHolder.use(this._dagId).fireNiceDagChange();
        }
        return viewNode;
    }

    destory(): void {
        this.vNodes.forEach(vNode => vNode.destory());
        this.pEdges.forEach(pEdge => pEdge.destory());
        this.pChildVMs.forEach(childVm => childVm.destory());
        this.listeners = [];
    }

    removeEdge(edge: IEdge): boolean {
        if (this.pEdges.some(pEdge => pEdge === edge)) {
            this.pEdges = this.pEdges.filter(pEdge => pEdge !== edge);
            niceDagHolder.use(this._dagId).fireNiceDagChange();
            return true;
        }
        return false;
    }

    findEdgesBySourceId(id: string): IEdge[] {
        return this.pEdges.filter(edge => edge.source.id === id);
    }

    findEdgesByTargetId(id: string): IEdge[] {
        return this.pEdges.filter(edge => edge.target.id === id);
    }

    refreshJointNodes(): void {
        if (this.vmConfig.mode === NiceDagMode.WITH_JOINT_NODES) {
            const toDeleteJointNodes = this.vNodes.filter(vNode => vNode.joint && vNode.dependencies.length === 1);
            const jointNodeIds = new Set<string>(toDeleteJointNodes.map(vNode => vNode.id));
            const targetOfJointNodes = this.vNodes.filter(vNode => vNode.dependencies.some(nodeId => jointNodeIds.has(nodeId)));
            toDeleteJointNodes.forEach(jointNode => {
                /**
                 * To delete joint nodes only have one dependency
                 */
                const { dependencies } = jointNode;
                const source = this.findNodeById(dependencies[0]);
                const targetNodes = targetOfJointNodes.filter(targetOfJointNode => targetOfJointNode.dependencies.some(depId => depId === jointNode.id));
                targetNodes.forEach(targetNode => {
                    targetNode.dependencies.push(source.id);
                    this.createEdgeAndFireModelChange(source, targetNode);
                });
            });
            toDeleteJointNodes.forEach(toDeleteJointNode => {
                toDeleteJointNode.remove();
            });
        }
    }

    createEdgeAndFireModelChange(source: IViewNode, target: IViewNode): IEdge {
        const newEdge = new Edge(source, target);
        this.pEdges.push(newEdge);
        this.fireModelChange({
            source: this,
            originalSource: newEdge,
            type: ViewModelChangeEventType.ADD_EDGE
        });
        newEdge.doLayout();
        return newEdge;
    }

    // createJointNodeIfAbsent(source: IViewNode, target: IViewNode): IViewNode {
    //     const precendentedNodes = this.findPrecedentedNodes(target);
    //     let jointNode = precendentedNodes.find(node => node.joint);
    //     if (!jointNode) {
    //         const id = `joint-${target.dependencies.join('-')}`;
    //         const node: Node = {
    //             id,
    //             dependencies: [...target.dependencies],
    //         };
    //         const vNode = new ViewNode(node, true, this, this.vmConfig.jointEdgeConnectorType);
    //         const jointNodePoint = spaceUtils.getCenter([source, ...precendentedNodes],
    //             target, niceDagHolder.use(this._dagId).config.graphLabel);
    //         const { getNodeSize } = niceDagHolder.use(this.dagId).config;
    //         const nodeSize = getNodeSize(vNode);
    //         jointNode = this.addNode(vNode,
    //             {
    //                 x: jointNodePoint.x - nodeSize.width / 2,
    //                 y: jointNodePoint.y - nodeSize.height / 2
    //             }, true);
    //         target.dependencies = [jointNode.id];
    //         const targetEdge = this.createEdgeAndFireModelChange(jointNode, target);
    //         targetEdge.doLayout();
    //     }
    //     return jointNode;
    // }

    addEdge(source: IViewNode, target: IViewNode): IEdge {
        // const endNodes = utils.findEndNodes(this.vNodes);
        // const isEndNode = endNodes.some(item => item.id === target.id);
        // if (this.vmConfig.mode === NiceDagMode.WITH_JOINT_NODES && !target.joint && target.dependencies?.length > 1 && !isEndNode) {
        //     /**
        //      * target dependencies has already added source dependencies
        //      */
        //     const existingEdges = this.pEdges.filter(edge => edge.target.id === target.id && !edge.source.joint);
        //     const jointNode = this.createJointNodeIfAbsent(source, target);
        //     existingEdges.forEach(existingEdge => {
        //         existingEdge.target = jointNode;
        //         existingEdge.doLayout();
        //     });
        //     const sourceToJointEdge = this.createEdgeAndFireModelChange(source, jointNode);
        //     niceDagHolder.use(this._dagId).fireNiceDagChange();
        //     return sourceToJointEdge;
        // } else {
        const newEdge = this.createEdgeAndFireModelChange(source, target);
        niceDagHolder.use(this._dagId).fireNiceDagChange();
        return newEdge;
        // }
    }

    /**
     * Watch sub child view model change
     * @param event 
     */
    onModelChange(event: IViewModelChangeEvent): void {
        /**
         * Avoid event storm when do prettify
         */
        if ((event.source as ViewModel).id! !== this.id) {
            if (event.type === ViewModelChangeEventType.RESIZE) {
                const vNode = this.vNodes.find(vNode => vNode.id === (event.source as ViewModel).id);
                vNode.resize((event.source as ViewModel).size());
            }
        }
    }

    /**
     * Watch nodes change
     * @param event 
     */
    onNodeChange = (event: ViewNodeChangeEvent): void => {
        if (event.type === ViewNodeChangeEventType.EXPAND_NODE) {
            this.setNodeCollapse(event.node as IViewNode, false);
        } else if (event.type === ViewNodeChangeEventType.SHRINK_NODE) {
            this.setNodeCollapse(event.node as IViewNode, true);
        } else if (event.type === ViewNodeChangeEventType.ADD_CHILD_NODE) {
            const { isCollapsed, point, sourceNode } = event.data;
            this.fireModelChange({
                source: this,
                originalSource: event.node,
                type: ViewModelChangeEventType.ADD_NODE
            });
            if (isCollapsed) {
                this.setNodeCollapse(event.node as IViewNode, false);
            } else {
                const childVm = this.pChildVMs.find(vm => vm.id === (event.node as IViewNode).id);
                childVm.addNode(sourceNode, point);
            }
        } else if (event.type === ViewNodeChangeEventType.POSITION_CHANGE
            || event.type === ViewNodeChangeEventType.RESIZE) {
            this.doLayout(true, false);
        } else if (event.type === ViewNodeChangeEventType.REMOVED) {
            this.pChildVMs = this.pChildVMs.filter(childVm => childVm.id !== event.node.id);
            this.vNodes = this.vNodes.filter(vNode => vNode.id !== event.node.id);
            this.pEdges = this.pEdges.filter(edge => !(edge.source.id === event.node.id || edge.target.id === event.node.id));
            this.fireModelChange({
                source: this,
                originalSource: event.node,
                type: ViewModelChangeEventType.REMOVE_NODE
            });
        }
    }

    private createChildVm(node: Node, children: Node[]): ViewModel {
        const childVm = new ViewModel({
            dagId: this._dagId,
            parentNode: node, nodes: children, vmConfig: this.vmConfig
        });
        childVm.addModelChangeListener(this);
        return childVm;
    }

    get isRoot(): boolean {
        return this.isRootModel;
    }

    addModelChangeListener = (listener: ViewModelChangeListener): void => {
        if (!this.listeners.some(l => l === listener)) {
            this.listeners.push(listener);
        }
    }

    removeNodeChangeListener = (listener: ViewModelChangeListener): void => {
        this.listeners = this.listeners.filter(l => l === listener);
    }

    getAllNodes(): IViewNode[] {
        let allViewNodes = [...this.vNodes];
        this.pChildVMs?.forEach(vm => {
            allViewNodes = [...allViewNodes, ...vm.getAllNodes()];
        });
        return allViewNodes;
    }

    getAllEdges(): IEdge[] {
        let allEdges = [...this.edges];
        this.pChildVMs?.forEach(vm => {
            allEdges = [...allEdges, ...vm.getAllEdges()];
        });
        return allEdges;
    }

    isSubViewNode = (id: string): boolean => {
        return !utils.isEmpty(this.pChildVMs?.filter(vm => vm.id === id));
    }

    findNodeById = (id: string): IViewNode => {
        let vNode: IViewNode = this.vNodes.find(node => node.id === id);
        if (!vNode && !utils.isEmpty(this.pChildVMs)) {
            for (let i = 0; i < this.pChildVMs.length; i++) {
                vNode = this.pChildVMs[i].findNodeById(id);
                if (vNode) {
                    break;
                }
            }
        }
        return vNode;
    }

    findNodesByPrecedentNodeId(id: string): IViewNode[] {
        return this.vNodes.filter(node => {
            const dependenciesSet = new Set(node.dependencies || []);
            return dependenciesSet.has(id);
        });
    }

    findNodesByDependencies = (dependencies: string[]): IViewNode[] => {
        const dependenciesSet = new Set(dependencies);
        return this.vNodes.filter(node => dependenciesSet.has(node.id));
    }

    private init = (_nodes: Node[]) => {
        this.buildVNodes(_nodes);
        this.buildEdges();
        this.doLayout(false, false);
    }

    private setNodeCollapse = (vNode: IViewNode, collapse: boolean): void => {
        let size;
        const { getNodeSize } = niceDagHolder.use(this.dagId).config;
        if (collapse) {
            this.pChildVMs = this.pChildVMs.filter(vm => vm.id !== vNode.id);
            size = getNodeSize(vNode);
        } else {
            const subViewModel = this.createChildVm(vNode, vNode.children);
            this.pChildVMs = [...this.pChildVMs.filter(vm => vm.id !== subViewModel.id), subViewModel];
            size = subViewModel.size();
        }
        //todo: extra to a separated method due to lazy loading, yufei
        vNode.width = size.width;
        vNode.height = size.height;
        const oldEditing = vNode.editing;
        vNode.editing = false;
        this.doLayout(true, false);
        vNode.editing = oldEditing;
        //notify view changes
        this.fireModelChange({
            source: this,
            originalSource: vNode,
            type: collapse ? ViewModelChangeEventType.REMOVE_SUB_VIEW : ViewModelChangeEventType.ADD_SUB_VIEW
        });
        niceDagHolder.use(this._dagId).fireNiceDagChange();
    }

    get dagId(): string {
        return this._dagId;
    }

    private fireModelChange = (e: IViewModelChangeEvent): void => {
        this.listeners.forEach(listener => {
            listener.onModelChange(e);
        });
    }

    private withJointNodes = (): IViewNode[] => {
        const gateNodes: IViewNode[] = [];
        /**
         * Deep clone due to dependency list needs to change when gate nodes are added
         */
        const endNodes = utils.findEndNodes(this.vNodes);
        const gateIds = new Set();
        this.vNodes.forEach(node => {
            const isEndNode = endNodes.some(item => item.id === node.id);
            if (node.dependencies?.length > 1 && !isEndNode) {
                const id = `joint-${node.dependencies.join('-')}`;
                if (!gateIds.has(id)) {
                    const jointViewNode = new ViewNode({
                        id,
                        dependencies: node.dependencies,
                    }, true, this, this.vmConfig.jointEdgeConnectorType);
                    jointViewNode.addNodeChangeListener(this);
                    gateNodes.push(jointViewNode);
                    gateIds.add(id);
                }
                node.dependencies = [id];
            }
        });
        return [...this.vNodes, ...gateNodes];
    }

    buildVNodes = (_nodes: Node[]): void => {
        this.vNodes = _nodes.map(node => this.toViewNode(node));
        if (this.vmConfig.mode === NiceDagMode.WITH_JOINT_NODES) {
            this.vNodes = this.withJointNodes();
        }
        this.withNodeSize();
    }

    toViewNode(node: Node): IViewNode {
        const viewNode = new ViewNode(node, false, this, node.edgeConnectorType || this.vmConfig.edgeConnectorType);
        viewNode.addNodeChangeListener(this);
        return viewNode;
    }

    private withNodeSize = () => {
        //create children map for computing child VM size
        const childrenMap: Record<string, ViewModel> = {};
        const { getNodeSize } = niceDagHolder.use(this.dagId).config;
        this.pChildVMs.forEach(vm => childrenMap[vm.id] = vm);
        this.vNodes.forEach(node => {
            const nodeSize = childrenMap[node.id] && !node.collapse ? childrenMap[node.id].size() : getNodeSize(node);
            node.width = nodeSize.width;
            node.height = nodeSize.height;
        });
    }

    get subViewPadding(): Padding {
        return this.vmConfig.subViewPadding;
    }

    resize = (fireModelChange: boolean): boolean => {
        const oldSize = this.pSize;
        const subViewPadding = this.isRoot ? this.vmConfig.rootViewPadding : this.vmConfig.subViewPadding;
        let maxRight = 0;
        let maxBottom = 0;
        this.vNodes.forEach(vNode => {
            maxRight = Math.max(vNode.x + vNode.width, maxRight);
            maxBottom = Math.max(vNode.y + vNode.height, maxBottom);
        });
        this.pSize = {
            width: maxRight + subViewPadding.left + subViewPadding.right,
            height: maxBottom + subViewPadding.top + subViewPadding.bottom
        };
        if (fireModelChange) {
            if (this.pSize.width !== oldSize.width || this.pSize.height !== oldSize.height) {
                this.fireModelChange({
                    source: this,
                    type: ViewModelChangeEventType.RESIZE
                });
                return true;
            }
        }
        return false;
    }

    doLayout = (fireModelChange: boolean, cascade: boolean): boolean => {
        if (cascade) {
            this.childVMs.forEach(childVM => {
                childVM.doLayout(fireModelChange, cascade);
                this.vNodes.find(node => node.id === childVM.id).resize(childVM.size());
            });
        }
        const dagre = buildDagre(this.vNodes, niceDagHolder.use(this.dagId).config.graphLabel);
        /**
         * Step 4. Set node position
         */
        let i = 0;
        this.vNodes.forEach(node => {
            if (!node.editing) {
                const dagreNode = dagre.node(String(i));
                const { width, height } = node;
                const x = dagreNode.x - width / 2;
                const y = dagreNode.y - height / 2;
                node.x = x;
                node.y = y;
                node.doLayout();
            }
            i++;
        });
        const resized = this.resize(fireModelChange);
        this.pEdges.forEach(edge => {
            edge.doLayout();
        });
        return resized;
    }

    buildEdges = (): void => {
        this.pEdges = [];
        const nodeMap: Record<string, IViewNode> = {};
        this.vNodes.forEach(vNode => nodeMap[vNode.id] = vNode);
        this.vNodes.forEach(vNode => {
            if (!utils.isEmpty(vNode.dependencies)) {
                vNode.dependencies.forEach(dependency => {
                    this.pEdges.push(new Edge(nodeMap[dependency], vNode));
                });
            }
        });
    }

    get parentNode(): Node {
        return this._parentNode;
    }

    get id(): string {
        return this._parentNode?.id;
    }

    size = (withPadding: boolean = true): Size => {
        if (withPadding) {
            return this.pSize;
        }
        const padding = this.isRoot ? this.vmConfig.rootViewPadding : this.subViewPadding;
        return {
            width: this.pSize.width - padding.left - padding.right,
            height: this.pSize.height - padding.top - padding.bottom,
        };
    }

    get(): Size {
        return this.pSize;
    }

    get childVMs(): ViewModel[] {
        return this.pChildVMs;
    }

    get nodes(): IViewNode[] {
        return this.vNodes;
    }

    get edges(): IEdge[] {
        return this.pEdges;
    }
}