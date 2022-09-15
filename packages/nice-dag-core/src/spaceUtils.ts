import {
    Bounds,
    Point,
    NiceDagDirection,
} from "./types";


export function getCenter(sources: Bounds[], target: Bounds, graphLabel: dagre.GraphLabel): Point {
    if (NiceDagDirection.LR === graphLabel.rankdir) {
        const top = Math.min(...sources.map(node => node.y));
        const bottom = Math.max(...sources.map(node => node.y + node.height));
        const centerY = (top + bottom) / 2;
        const sourceRight = Math.max(...sources.map(node => node.x + node.width));
        let centerXOffset = (target.x - sourceRight) / 2;
        return {
            y: centerY,
            x: sourceRight + centerXOffset
        };
    }
    return null;
}