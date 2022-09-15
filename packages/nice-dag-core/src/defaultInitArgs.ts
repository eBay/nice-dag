import {
  IEdge,
  EdgeAttributes,
  EdgePoints,
  Padding,
  Point,
  EdgeConnectorType,
  IViewNode,
} from "./types";
import { valueWithDefault } from "./utils";

const DEFAULT_GRAPH_LABEL = {
  rankdir: "LR",
  ranksep: 60,
  edgesep: 10,
};

export const DEFAULT_GRID_CONFIG = {
  color: "blue",
  size: 40,
};

export const DEFAULT_SUBVIEW_PADDING = {
  top: 40,
  bottom: 20,
  left: 20,
  right: 20,
};

export const ZERO_PADDING = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
};

export const ZERO_PADDING_STYLE = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

const DEFAULT_EDGE_ATTRIBUTES = {
  color: "black",
};

function getCenterPoints(node: IViewNode): Point {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

export const mapEdgeToPointsWithDir = {
  LR: ({ source, target }: IEdge): EdgePoints => {
    const sp: Point =
      source.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(source)
        : {
            x: source.x + source.width,
            y: source.y + source.height / 2,
          };
    const tp: Point =
      target.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(target)
        : { x: target.x, y: target.y + target.height / 2 };
    return {
      source: sp,
      target: tp,
    };
  },
  RL: ({ source, target }: IEdge): EdgePoints => {
    const sp: Point =
      source.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(source)
        : { x: source.x, y: source.y + source.height / 2 };
    const tp: Point =
      target.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(target)
        : {
            x: target.x + target.width,
            y: target.y + target.height / 2,
          };
    return {
      source: sp,
      target: tp,
    };
  },
  BT: ({ source, target }: IEdge): EdgePoints => {
    const sp: Point =
      source.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(source)
        : { x: source.x + source.width / 2, y: source.y };
    const tp: Point =
      target.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(target)
        : {
            x: target.x + target.width / 2,
            y: target.y + target.height,
          };
    return {
      source: sp,
      target: tp,
    };
  },
  TB: ({ source, target }: IEdge): EdgePoints => {
    const sp: Point =
      source.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(source)
        : {
            x: source.x + source.width / 2,
            y: source.y + source.height,
          };
    const tp: Point =
      target.edgeConnectorType === EdgeConnectorType.CENTER
        ? getCenterPoints(target)
        : { x: target.x + target.width / 2, y: target.y };
    return {
      source: sp,
      target: tp,
    };
  },
};

export function graphLabelWithDefaultValues(
  graphLabel?: dagre.GraphLabel
): dagre.GraphLabel {
  return graphLabel
    ? {
        ...graphLabel,
        rankdir: graphLabel.rankdir || DEFAULT_GRAPH_LABEL.rankdir,
        ranksep: graphLabel.ranksep || DEFAULT_GRAPH_LABEL.ranksep,
        edgesep: graphLabel.edgesep || DEFAULT_GRAPH_LABEL.edgesep,
      }
    : DEFAULT_GRAPH_LABEL;
}

export function paddingWithDefaultValues(
  padding?: Padding,
  defaultValues: Padding = ZERO_PADDING
): Padding {
  return {
    top: valueWithDefault(padding?.top, defaultValues.top),
    left: valueWithDefault(padding?.left, defaultValues.left),
    bottom: valueWithDefault(padding?.bottom, defaultValues.bottom),
    right: valueWithDefault(padding?.right, defaultValues.right),
  };
}

export function getDefaultEdgesAttributes(): EdgeAttributes {
  return DEFAULT_EDGE_ATTRIBUTES;
}
