import { HtmlElementBounds, MapEdgeToPoints, Point, StyleObjectType, IViewNode, NiceDagMode, MapNodeToDraggingElementClass, EdgePoints } from './types';
import * as utils from './utils';
import DndContext from './dndContext';
import { NICE_DAG_NODE_CLS, NODE_ID_ATTR, SVG_DND_ARROW_ID } from './constants';
import { XDirection, YDirection } from './dndTypes';
import * as niceDagHolder from './niceDagHolder';

const GLASS_NODE_CLS = 'nice-dag-dnd-glass';

const GLASS_STYLE = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    zIndex: '9999',
    display: 'none',
    'user-select': 'none'
};

function isPointInBounds(point: Point, bounds: HtmlElementBounds) {
    return bounds.x <= point.x && bounds.y <= point.y && bounds.right >= point.x && bounds.bottom >= point.y;
}

interface ViewNodeWithGlobalBounds {
    viewNode: IViewNode;
    bounds: HtmlElementBounds;
}

interface DraggingEdge {
    viewNode: IViewNode;
    svgRef: SVGElement;
}

export default class NiceDagDnd {

    private _rootContainer: HTMLElement;
    private _glassStyles: StyleObjectType;
    private draggingNode: IViewNode;
    private draggingNodeMirror: IViewNode;
    private draggingElement: HTMLElement | SVGElement;
    private _enabled: boolean;
    private editableGlass: HTMLElement;
    private editorForeContainer: HTMLElement;
    private context: DndContext;
    private isDraggingEdge: boolean;
    private mapEdgeToPoints: MapEdgeToPoints;
    private draggingNodeParentBounds: HtmlElementBounds;
    private svgBackgroundBounds: HtmlElementBounds;
    private eligibleEdgeConnectors: ViewNodeWithGlobalBounds[] = [];
    private originalScrollPosition: Point;
    private mapNodeToDraggingElementClass: MapNodeToDraggingElementClass;
    private asSourceDraggingEdges: DraggingEdge[];
    private asTargetDraggingEdges: DraggingEdge[];
    private documentUserSelect: string;

    constructor(rootContainer: HTMLElement, glassStyles: StyleObjectType,
        mapEdgeToPoints: MapEdgeToPoints, editorForeContainer: HTMLElement, mapNodeToDraggingElementClass: StyleObjectType) {
        this._rootContainer = rootContainer;
        this._glassStyles = glassStyles;
        this.mapEdgeToPoints = mapEdgeToPoints;
        this.editorForeContainer = editorForeContainer;
        this.mapNodeToDraggingElementClass = mapNodeToDraggingElementClass;
        this.buildGlass();
    }

    buildGlass = () => {
        const editableGlass = utils.createElementIfAbsent(document.body, GLASS_NODE_CLS).withStyle({
            ...GLASS_STYLE,
            cursor: this._glassStyles?.cursor || 'pointer',
        });
        if (!editableGlass.alreadyExists) {
            editableGlass.htmlElement.addEventListener('mousemove', this.onDragging);
            editableGlass.htmlElement.addEventListener('mouseup', this.endDragging);
        }
        this.editableGlass = editableGlass.htmlElement;
    }

    setEnabled = (enabled: boolean) => {
        this._enabled = enabled;
    }

    private initContext = (node: IViewNode): void => {
        this.originalScrollPosition = {
            x: this._rootContainer.scrollLeft,
            y: this._rootContainer.scrollTop
        };
        this.draggingNode = node;
        this.draggingNodeMirror = node.cloneWithProps();
        const scale: number = this.context.provider.scale || 1;
        this.draggingNodeParentBounds = utils.resetBoundsWithRatio(utils.htmlElementBounds(node.ref.parentElement), scale);
        this.svgBackgroundBounds = utils.resetBoundsWithRatio(utils.htmlElementBounds(this.context.provider.svgDndBackground), scale);
        const niceDagNodes = node.ref.parentElement.querySelectorAll(`:scope>.${NICE_DAG_NODE_CLS}`);
        this.eligibleEdgeConnectors = [];
        niceDagNodes.forEach(niceDagNode => {
            if (niceDagNode !== node.ref) {
                this.eligibleEdgeConnectors.push(
                    {
                        viewNode: node.model.findNodeById(niceDagNode.getAttribute(NODE_ID_ATTR)),
                        bounds: utils.htmlElementBounds(niceDagNode as HTMLElement)
                    }
                );
            }
        });
    }

    withContext = (dndContext: DndContext): NiceDagDnd => {
        this.context = dndContext;
        return this;
    }

    buildDraggingElement = (node: IViewNode) => {
        const scale: number = this.context.provider.scale || 1;
        const { width, height, x, y } = utils.resetBoundsWithRatio(utils.htmlElementBounds(node.ref), scale);
        return utils.createElement(null, this.mapNodeToDraggingElementClass(node))
            .withAbsolutePosition({
                width, height, x, y
            }).htmlElement;
    }

    computeDependenciesOfDraggingNode = (node: IViewNode) => {
        const svg = this.context.provider.svgDndBackground;
        this.asSourceDraggingEdges = node.findEdgesAsSource().map(edge => {
            return {
                svgRef: utils.createSvgElement(svg, 'path').withAttributes({
                    'stroke': 'rgb(204, 204, 204)', //todo:conside constant
                    'marker-mid': `url(#${node.model.dagId}-${SVG_DND_ARROW_ID})`
                }).svgElement,
                viewNode: edge.target
            };
        });
        this.asTargetDraggingEdges = node.findEdgesAsTarget().map(edge => {
            return {
                svgRef: utils.createSvgElement(svg, 'path').withAttributes({
                    'stroke': 'rgb(204, 204, 204)', //todo:conside constant
                    'marker-mid': `url(#${node.model.dagId}-${SVG_DND_ARROW_ID})`
                }).svgElement,
                viewNode: edge.source
            };
        })
    }

    disableUserSelect = () => {
        this.documentUserSelect = document.body.style.userSelect;
        utils.editHtmlElement(document.body).withStyle({
            'user-select': 'none'
        });
    }

    restoreUserSelect = () => {
        utils.editHtmlElement(document.body).withStyle({
            'user-select': this.documentUserSelect
        });
    }

    startNodeDragging = (node: IViewNode, e: MouseEvent): void => {
        if (this._enabled) {
            utils.editHtmlElement(this.editableGlass).withStyle({
                display: 'block'
            });
            this.disableUserSelect();
            this.initContext(node);
            this.updateRelativeMousePoint({
                x: e.pageX,
                y: e.pageY
            });
            this.computeDependenciesOfDraggingNode(node);
            this.draggingElement = (!this.mapNodeToDraggingElementClass ? node.ref.cloneNode(true) : this.buildDraggingElement(node)) as HTMLElement;
            utils.editHtmlElement(this.draggingElement).withStyle({
                'user-select': 'none',
                'z-index': 9
            });
            this.moveDraggingElement();
            this.editorForeContainer.appendChild(this.draggingElement);
        }
    }

    moveDraggingElement = () => {
        const lastBounds = this.context.lastBounds(true, true);
        utils.editHtmlElement(this.draggingElement).withAbsolutePosition({
            x: lastBounds.left,
            y: lastBounds.top,
            width: lastBounds.width,
            height: lastBounds.height
        });
        this.renderEdgesWhenDraggingElement(lastBounds);
    }

    renderEdge = (edgeSvg: SVGElement, edgePoints: EdgePoints) => {
        const { source, target } = edgePoints;
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const path = `M${source.x},${source.y} L${midX},${midY} L${target.x},${target.y}`;
        utils.editHtmlElement(edgeSvg).withAttributes({
            'd': path
        });
    }

    mapEdgePointToGlobal = (edgePoints: EdgePoints) => {
        const { source: edgeSource, target: edgeTarget } = edgePoints;
        const source = {
            x: edgeSource.x + this.draggingNodeParentBounds.x - this.svgBackgroundBounds.x,
            y: edgeSource.y + this.draggingNodeParentBounds.y - this.svgBackgroundBounds.y
        };
        const target = {
            x: edgeTarget.x + this.draggingNodeParentBounds.x - this.svgBackgroundBounds.x,
            y: edgeTarget.y + this.draggingNodeParentBounds.y - this.svgBackgroundBounds.y
        };
        return {
            source, target
        }
    }

    renderEdgesWhenDraggingElement = (lastBounds: HtmlElementBounds): void => {
        this.draggingNodeMirror.x = lastBounds.x - (this.draggingNodeParentBounds.x - this.svgBackgroundBounds.x);
        this.draggingNodeMirror.y = lastBounds.y - (this.draggingNodeParentBounds.y - this.svgBackgroundBounds.y);
        this.draggingNodeMirror.width = lastBounds.width;
        this.draggingNodeMirror.height = lastBounds.height;
        this.asSourceDraggingEdges?.forEach(edge => {
            this.renderEdge(edge.svgRef, this.mapEdgePointToGlobal(this.mapEdgeToPoints({
                source: this.draggingNodeMirror,
                target: edge.viewNode
            })));
        });
        this.asTargetDraggingEdges?.forEach(edge => {
            this.renderEdge(edge.svgRef, this.mapEdgePointToGlobal(this.mapEdgeToPoints({
                source: edge.viewNode,
                target: this.draggingNodeMirror
            })));
        });
    }

    startEdgeDragging = (node: IViewNode, e: MouseEvent): void => {
        if (this._enabled) {
            utils.editHtmlElement(this.editableGlass).withStyle({
                display: 'block'
            });
            this.disableUserSelect();
            this.isDraggingEdge = true;
            const svg = this.context.provider.svgDndBackground;
            this.draggingElement = utils.createSvgElement(svg, 'path').withAttributes({
                'stroke': 'rgb(204, 204, 204)', //todo:conside constant
                'marker-mid': `url(#${node.model.dagId}-${SVG_DND_ARROW_ID})`
            }).svgElement;
            this.initContext(node);
            this.updateRelativeMousePoint({
                x: e.pageX,
                y: e.pageY
            });
        }
    }

    destory(): void {
        this.editableGlass.remove();
    }

    private onDraggingEdge(mPoint: Point) {
        let targetNode = this.draggingNode;
        const potentialEdgeTarget = this.findPotentialEdgeTarget(mPoint);
        if (potentialEdgeTarget) {
            targetNode = potentialEdgeTarget as IViewNode;
        }
        let { source, target } = this.mapEdgePointToGlobal(this.mapEdgeToPoints({
            source: this.draggingNode,
            target: targetNode
        }));
        const scale: number = this.context.provider.scale || 1;
        const backgroundBounds = utils.resetBoundsWithRatio(this.context.provider.svgDndBackground.getBoundingClientRect(), scale);
        target = {
            x: (targetNode !== this.draggingNode ? target.x : (utils.float2Int(mPoint.x / scale)) - backgroundBounds.x),
            y: (targetNode !== this.draggingNode ? target.y : (utils.float2Int(mPoint.y / scale)) - backgroundBounds.y)
        };
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const path = `M${source.x},${source.y} L${midX},${midY} L${target.x},${target.y}`;
        utils.editHtmlElement(this.draggingElement).withAttributes({
            'd': path
        });
    }

    private findPotentialEdgeTarget(mPoint: Point): IViewNode {
        const potentialConnector: ViewNodeWithGlobalBounds =
            this.eligibleEdgeConnectors.find(connector => isPointInBounds(mPoint, connector.bounds));
        if (potentialConnector && !potentialConnector.viewNode.dependencies?.some(dependency => dependency === this.draggingNode.id)) {
            if (niceDagHolder.use(this.draggingNode.model.dagId).config.mode === NiceDagMode.WITH_JOINT_NODES) {
                if (!potentialConnector.viewNode.dependencies || potentialConnector.viewNode.dependencies.length === 0 || potentialConnector.viewNode.joint) {
                    return potentialConnector.viewNode;
                }
            } else {
                return potentialConnector.viewNode;
            }
        }
        return null;
    }

    onDragging = (event: MouseEvent): void => {
        event.stopPropagation();
        if (event.button === 0) {
            const mPoint = {
                x: event.pageX,
                y: event.pageY,
            };
            if (this.context) {
                const rootBounds = this._rootContainer.getBoundingClientRect();
                const xDirection = this.context.xDirection(mPoint, rootBounds);
                const yDirection = this.context.yDirection(mPoint, rootBounds);
                this.updateRelativeMousePoint(mPoint);
                if (this.isDraggingEdge) {
                    this.onDraggingEdge(mPoint);
                } else {
                    this.onDraggingNode(xDirection, yDirection);
                }
            }
        }
    }

    onDraggingNode(xDirection: XDirection, yDirection: YDirection): void {
        this.scrollIfNeeded({
            xDirection, yDirection
        });
        this.moveDraggingElement();
    }

    endDragging = (event: MouseEvent): void => {
        this.draggingElement?.remove();
        [...this.asSourceDraggingEdges || [], ...this.asTargetDraggingEdges || []].forEach(edge => {
            edge.svgRef.remove();
        });
        const mPoint = {
            x: event.pageX,
            y: event.pageY,
        };
        this.updateRelativeMousePoint(mPoint);
        const scrollDelta = {
            x: this._rootContainer.scrollLeft - this.originalScrollPosition.x,
            y: this._rootContainer.scrollTop - this.originalScrollPosition.y,
        };
        const scale = this.context.provider.scale || 1;
        let targetNode;
        if (!this.isDraggingEdge) {
            this.draggingNode.setPoint(
                {
                    x: this.draggingNode.x + this.context.xyDelta.x / scale + scrollDelta.x,
                    y: this.draggingNode.y + this.context.xyDelta.y / scale + scrollDelta.y
                }
            );
        } else {
            targetNode = this.findPotentialEdgeTarget(mPoint);
            if (targetNode) {
                this.draggingNode.connect(targetNode);
            }
        }
        utils.editHtmlElement(this.editableGlass).withStyle({
            display: 'none'
        });
        utils.editHtmlElement(this.editorForeContainer).withStyle({
            display: 'none'
        });
        if (!this.isDraggingEdge) {
            this.context.provider.endNodeDragging(this.draggingNode);
        } else {
            this.context.provider.endEdgeDragging(this.draggingNode, targetNode);
        }
        this.isDraggingEdge = false;
        this.restoreUserSelect();
    }

    private updateRelativeMousePoint = (mPoint: Point) => {
        const rootBounds = this._rootContainer.getBoundingClientRect();
        this.context.moveTo(mPoint, rootBounds);
        if (!this.isDraggingEdge) {
            const lastBounds = this.context.lastBounds();
            const parentTopLeft = this.context.provider.getParentTopLeft(this.draggingNode);
            let xDelta = 0;
            let yDelta = 0;
            if (lastBounds.left < parentTopLeft.x) {
                xDelta = parentTopLeft.x - lastBounds.left;
            }
            if (lastBounds.top < parentTopLeft.y) {
                yDelta = parentTopLeft.y - lastBounds.top;
            }
            this.context.moveTo({
                x: mPoint.x + xDelta,
                y: mPoint.y + yDelta
            }, rootBounds);
        }
    }

    private scrollIfNeeded = ({ xDirection, yDirection }: { xDirection: XDirection, yDirection: YDirection }) => {
        // const rootBounds = this._rootContainer.getBoundingClientRect();
        // const lastGlobalBounds = utils.htmlElementBounds(this.draggingElement as HTMLElement);
        // this.context.provider.resizeForeground(this.context.lastBounds(true, true));
        // let xDelta = 0;
        // let yDelta = 0;
        // if (xDirection === XDirection.LeftToRight && lastGlobalBounds.right > rootBounds.right) {
        //     xDelta = lastGlobalBounds.right - rootBounds.right;
        // }
        // if (xDirection === XDirection.RightToLeft && lastGlobalBounds.left < rootBounds.left) {
        //     xDelta = -(rootBounds.left - lastGlobalBounds.left);
        // }
        // if (yDirection === YDirection.TopToBottom && lastGlobalBounds.bottom >= rootBounds.bottom) {
        //     yDelta = lastGlobalBounds.bottom - rootBounds.bottom;
        // }
        // if (yDirection === YDirection.BottomToTop && lastGlobalBounds.top < rootBounds.top) {
        //     yDelta = -(rootBounds.top - lastGlobalBounds.top);
        // }
        // this._rootContainer.scrollLeft += xDelta;
        // this._rootContainer.scrollTop += yDelta;
    }
}