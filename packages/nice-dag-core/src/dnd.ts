import { HtmlElementBounds, MapEdgeToPoints, Point, StyleObjectType, IViewNode, NiceDagMode } from './types';
import * as utils from './utils';
import DndContext from './dndContext';
import { NICE_DAG_NODE_CLS, NODE_ID_ATTR, SVG_DND_ARROW_ID } from './constants';
import { XDirection, YDirection } from './dndTypes';
import * as niceDagHolder from './niceDagHolder';

const GLASS_NODE_CLS = 'dnd-glass';

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

export default class NiceDagDnd {

    private _rootContainer: HTMLElement;
    private _glassStyles: StyleObjectType;
    private draggingNode: IViewNode;
    private draggingElement: HTMLElement | SVGElement;
    private _enabled: boolean;
    private editableGlass: HTMLElement;
    private context: DndContext;
    private isDraggingEdge: boolean;
    private mapEdgeToPoints: MapEdgeToPoints;
    private draggingNodeParentBounds: HtmlElementBounds;
    private eligibleEdgeConnectors: ViewNodeWithGlobalBounds[] = [];
    private originalScrollPosition: Point;

    constructor(rootContainer: HTMLElement, glassStyles: StyleObjectType,
        mapEdgeToPoints: MapEdgeToPoints) {
        this._rootContainer = rootContainer;
        this._glassStyles = glassStyles;
        this.mapEdgeToPoints = mapEdgeToPoints;
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
        this.draggingNodeParentBounds = utils.htmlElementBounds(node.ref.parentElement);
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

    startNodeDragging = (node: IViewNode, e: MouseEvent): void => {
        if (this._enabled) {
            utils.editHtmlElement(this.editableGlass).withStyle({
                display: 'block'
            });
            this.initContext(node);
            this.updateRelativeMousePoint({
                x: e.pageX,
                y: e.pageY
            });
            this.draggingElement = utils.editHtmlElement(node.ref.cloneNode(true) as HTMLElement).withStyle({
                'transform': `scale(${this.context.provider.scale})`,
                'transformOrigin': `top left`
            }).htmlElement;
            const lastBounds = this.context.lastBounds();
            utils.editHtmlElement(this.draggingElement).withStyle({
                'user-select': 'none',
                'z-index': 9
            }).withAbsolutePoint({
                x: lastBounds.left,
                y: lastBounds.top
            });
            this.editableGlass.appendChild(this.draggingElement);
        }
    }

    startEdgeDragging = (node: IViewNode, e: MouseEvent): void => {
        if (this._enabled) {
            utils.editHtmlElement(this.editableGlass).withStyle({
                display: 'block'
            });
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

    private renderDraggingEdge(mPoint: Point) {
        let targetNode = this.draggingNode;
        const potentialEdgeTarget = this.findPotentialEdgeTarget(mPoint);
        if (potentialEdgeTarget) {
            targetNode = potentialEdgeTarget as IViewNode;
        }
        const { source: edgeSource, target: edgeTarget } = this.mapEdgeToPoints({
            source: this.draggingNode,
            target: targetNode
        });
        const scale: number = this.context.provider.scale || 1;
        const backgroundBounds = utils.resetBoundsWithRatio(this.context.provider.svgDndBackground.getBoundingClientRect(), scale);
        const draggingNodeParentBounds = utils.resetBoundsWithRatio(this.draggingNodeParentBounds, scale);
        const source = {
            x: edgeSource.x + draggingNodeParentBounds.x - backgroundBounds.x,
            y: edgeSource.y + draggingNodeParentBounds.y - backgroundBounds.y
        };
        const edgeTargetGPoint = {
            x: edgeTarget.x + draggingNodeParentBounds.x,
            y: edgeTarget.y + draggingNodeParentBounds.y
        }
        const target = {
            x: (targetNode !== this.draggingNode ? edgeTargetGPoint.x : utils.float2Int(mPoint.x / scale)) - backgroundBounds.x,
            y: (targetNode !== this.draggingNode ? edgeTargetGPoint.y : utils.float2Int(mPoint.y / scale)) - backgroundBounds.y
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
                    this.renderDraggingEdge(mPoint);
                } else {
                    this.onDraggingNode(xDirection, yDirection);
                }
            }
        }
    }

    onDraggingNode(xDirection: XDirection, yDirection: YDirection): void {
        const lastBounds = this.context.lastBounds();
        this.scrollIfNeeded({
            xDirection, yDirection
        });
        utils.editHtmlElement(this.draggingElement).withAbsolutePoint(
            {
                x: lastBounds.left,
                y: lastBounds.top
            }
        );
    }

    endDragging = (event: MouseEvent): void => {
        this.draggingElement?.remove();
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
        utils.editHtmlElement(this.context.provider.svgDndBackground).withStyle({
            display: 'none'
        });
        if (!this.isDraggingEdge) {
            this.context.provider.endNodeDragging(this.draggingNode);
        } else {
            this.context.provider.endEdgeDragging(this.draggingNode, targetNode);
        }
        this.isDraggingEdge = false;
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
        const rootBounds = this._rootContainer.getBoundingClientRect();
        const lastGlobalBounds = utils.htmlElementBounds(this.draggingElement as HTMLElement);
        this.context.provider.resizeIfNeeded(lastGlobalBounds);
        let xDelta = 0;
        let yDelta = 0;
        if (xDirection === XDirection.LeftToRight && lastGlobalBounds.right > rootBounds.right) {
            xDelta = lastGlobalBounds.right - rootBounds.right;
        }
        if (xDirection === XDirection.RightToLeft && lastGlobalBounds.left < rootBounds.left) {
            xDelta = -(rootBounds.left - lastGlobalBounds.left);
        }
        if (yDirection === YDirection.TopToBottom && lastGlobalBounds.bottom >= rootBounds.bottom - 20) {
            yDelta = lastGlobalBounds.bottom - (rootBounds.bottom - 20);
        }
        if (yDirection === YDirection.BottomToTop && lastGlobalBounds.top < rootBounds.top) {
            yDelta = -(rootBounds.top - lastGlobalBounds.top);
        }
        this._rootContainer.scrollLeft += xDelta;
        this._rootContainer.scrollTop += yDelta;
    }
}