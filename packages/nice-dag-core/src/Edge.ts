import { ViewNodeChangeListener, ViewNodeChangeEvent, ViewNodeChangeEventType, IEdge, IViewNode, Node, NiceDagDirection, Point } from './types';
import * as utils from './utils';
import { NICE_DAG_EDGE_CLS, ZERO_BOUNDS } from './constants';
import * as niceDagHolder from './niceDagHolder';
import { getDirection } from './utils';

const EDGE_ELEMENT_HEIGHT = 12;

export default class Edge implements IEdge, ViewNodeChangeListener {
    source: IViewNode;
    target: IViewNode;
    pathRef?: SVGElement;
    ref?: HTMLElement;

    constructor(source: IViewNode, target: IViewNode) {
        this.source = source;
        this.target = target;
        this.pathRef = utils.createSvgElement(null, 'path').withAttributes({
            'data-source-key': source.id,
            'data-target-key': target.id,
        }).svgElement;
        this.ref = utils.createElement().withClassNames(NICE_DAG_EDGE_CLS).withAbsolutePosition(ZERO_BOUNDS).htmlElement;
        this.source.addNodeChangeListener(this);
        this.target.addNodeChangeListener(this);
    }

    destory(): void {
        this.source = null;
        this.target = null;
        this.pathRef = null;
        this.ref = null;
    }

    onNodeChange(event: ViewNodeChangeEvent): void {
        if (event.type === ViewNodeChangeEventType.POSITION_CHANGE
            || event.type === ViewNodeChangeEventType.RESIZE
            || event.type === ViewNodeChangeEventType.EXPAND_NODE
            || event.type === ViewNodeChangeEventType.SHRINK_NODE) {
            this.doLayout();
        } else if (event.type === ViewNodeChangeEventType.REMOVED) {
            this.remove();
            this.destory();
        }
    }

    insertNodes(nodes: Node[], offset = 40): void {
        const startPosition: Point = this.getInsertNodesStartPosition(nodes, offset);
        this.remove();
        const newViewNodes = this.target.model.addNodes(nodes, startPosition, offset);
        newViewNodes.forEach(newViewNode => {
            this.source.connect(newViewNode);
            newViewNode.connect(this.target);
        });
        this.destory();
    }

    private getInsertNodesStartPosition(nodes: Node[], offset: number): Point {
        const { graphLabel, getNodeSize, mapEdgeToPoints } = niceDagHolder.use(this.source.model.dagId).config;
        const { source, target } = mapEdgeToPoints(this);
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        let width = 0;
        let height = 0;
        let maxWidth = 0;
        let maxHeight = 0;
        const direction = getDirection(graphLabel);
        nodes.forEach(node => {
            const nodeSize = getNodeSize(node);
            if (direction === NiceDagDirection.LR || direction === NiceDagDirection.RL) {
                height += nodeSize.height + offset;
            } else {
                width += nodeSize.width + offset;
            }
            maxWidth = Math.max(width, nodeSize.width);
            maxHeight = Math.max(height, nodeSize.height);
        });
        height -= offset;
        width -= offset;
        if (direction === NiceDagDirection.LR || direction === NiceDagDirection.RL) {
            return {
                x: midX - maxWidth / 2,
                y: midY - height / 2
            }
        }
        return {
            x: midX - width / 2,
            y: midY - maxHeight / 2
        }
    }

    remove() {
        this.target.removeDependency(this.source);
        this.target.model.removeEdge(this);
        this.target.removeNodeChangeListener(this);
        this.source.removeNodeChangeListener(this);
        this.pathRef.remove();
        this.ref.remove();
    }

    doLayout() {
        const { mapEdgeToPoints } = niceDagHolder.use(this.source.model.dagId).config;
        const { source, target } = mapEdgeToPoints(this);
        const midX = (source.x + target.x) / 2;
        const midY = (source.y + target.y) / 2;
        const path = `M${source.x},${source.y} L${midX},${midY} L${target.x},${target.y}`;
        utils.editHtmlElement(this.pathRef).withAttributes({
            'd': path
        });
        const distance = Math.sqrt((target.x - source.x) * (target.x - source.x) + (target.y - source.y) * (target.y - source.y));
        const rotateStyle = `rotate(${utils.calcAngle(target.y - source.y, target.x - source.x)}deg)`;
        utils.editHtmlElement(this.ref).withAbsolutePosition({
            x: midX - distance / 2,
            y: midY - EDGE_ELEMENT_HEIGHT / 2,
            width: distance,
            height: EDGE_ELEMENT_HEIGHT
        }).withStyle({
            'webkitTransform': rotateStyle,
            'mozTransform': rotateStyle,
            'msTransform': rotateStyle,
            'oTransform': rotateStyle,
            'transform': rotateStyle
        });
    }
}