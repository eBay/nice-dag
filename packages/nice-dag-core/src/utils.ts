import {
  Node,
  StyleObjectType,
  ElementAttributesType,
  Bounds,
  IViewNode,
  HtmlElementBounds,
  Size,
  Point,
  NiceDagDirection,
} from "./types";


export function findEndNodes(nodes: IViewNode[] = []): IViewNode[] {
  let dependencies: string[] = [];
  nodes.forEach((node) => {
    dependencies = [...dependencies, ...(node.dependencies || [])];
  });
  const dependencySet = new Set(dependencies);
  return nodes.filter((node) => !dependencySet.has(node.id));
}

export function getInnerSize(element: HTMLElement): Size {
  const computedStyle = getComputedStyle(element);
  const height =
    element.clientHeight -
    parseFloat(computedStyle.paddingTop) -
    parseFloat(computedStyle.paddingBottom);
  const width =
    element.clientWidth -
    parseFloat(computedStyle.paddingLeft) -
    parseFloat(computedStyle.paddingRight);
  return {
    height,
    width,
  };
}

class EditableElement {
  private pElement: HTMLElement | SVGElement;
  private _exists: boolean;

  constructor(elm: HTMLElement | SVGElement, exists: boolean = false) {
    this.pElement = elm;
    this._exists = exists;
  }

  get alreadyExists(): boolean {
    return this._exists;
  }

  withStyle = (style: StyleObjectType): EditableElement => {
    const keys = Object.keys(style);
    keys.forEach((key) => {
      this.pElement.style[key] = style[key];
    });
    return this;
  };

  withAttributes = (attr: ElementAttributesType): EditableElement => {
    const keys = Object.keys(attr);
    keys.forEach((key) => {
      this.pElement.setAttribute(key, attr[key]);
    });
    return this;
  };

  withAbsolutePoint = (point: Point): EditableElement => {
    this.pElement.style.position = "absolute";
    this.pElement.style.top = `${point.y}px`;
    this.pElement.style.left = `${point.x}px`;
    return this;
  };

  withAbsolutePosition = (bounds: Bounds): EditableElement => {
    this.pElement.style.position = "absolute";
    this.pElement.style.top = `${bounds.y}px`;
    this.pElement.style.left = `${bounds.x}px`;
    this.pElement.style.width = `${bounds.width}px`;
    this.pElement.style.height = `${bounds.height}px`;
    return this;
  };

  withSize = (size: Size): EditableElement => {
    this.pElement.style.width = `${size.width}px`;
    this.pElement.style.height = `${size.height}px`;
    return this;
  };

  withWidth = (width: number): EditableElement => {
    this.pElement.style.width = `${width}px`;
    return this;
  };

  withHeight = (height: number): EditableElement => {
    this.pElement.style.height = `${height}px`;
    return this;
  };

  withClassNames = (...classNames: string[]): EditableElement => {
    classNames.forEach((className) => {
      this.pElement.classList.add(className);
    });
    return this;
  };

  get htmlElement(): HTMLElement {
    return this.pElement as HTMLElement;
  }

  get svgElement(): SVGElement {
    return this.pElement as SVGElement;
  }
}

export function editHtmlElement(
  htmlElement: HTMLElement | SVGElement
): EditableElement {
  return new EditableElement(htmlElement);
}

export function createElement(parentElement?: HTMLElement): EditableElement {
  const element = document.createElement("div");
  if (parentElement) {
    parentElement.appendChild(element);
  }
  return new EditableElement(element);
}

export function createElementIfAbsent(
  parentElement: HTMLElement,
  className: string
): EditableElement {
  let element = parentElement.querySelector(`.${className}`) as HTMLElement;
  const alreadyExists: boolean = !!element;
  if (!element) {
    element = document.createElement("div");
    element.classList.add(className);
    parentElement.appendChild(element);
  }
  return new EditableElement(element, alreadyExists);
}

export function createSvgElement(
  svg: SVGElement,
  name: string
): EditableElement {
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    name
  );
  if (svg) {
    svg.appendChild(svgElement);
  }
  return new EditableElement(svgElement);
}

export function createSvgIfAbsent(
  parentElement: HTMLElement,
  selector = ":scope>svg",
  markerId = "nice-dag-svg-arrow"
): EditableElement {
  let svgElement: SVGElement = selector
    ? parentElement.querySelector(selector)
    : null;
  if (!svgElement) {
    svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.style.overflow = "hidden";
    /**
     * Create arrow
     */
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const marker = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "marker"
    );
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    marker.setAttribute("id", markerId);
    marker.setAttribute("markerUnits", "strokeWidth");
    marker.setAttribute("markerWidth", "12");
    marker.setAttribute("markerHeight", "12");
    marker.setAttribute("viewBox", "0 0 12 12");
    marker.setAttribute("refX", "6");
    marker.setAttribute("refY", "6");
    marker.setAttribute("orient", "auto");
    path.setAttribute("d", "M2,2 L10,6 L2,10 L6,6 L2,2");
    path.setAttribute("fill", "#000");
    marker.appendChild(path);
    defs.appendChild(marker);
    svgElement.appendChild(defs);
    parentElement.appendChild(svgElement);
  }
  return new EditableElement(svgElement);
}

export function isEmpty(arr?: Array<any>): boolean {
  return !arr || arr.length === 0;
}

export function uuid() {
  return Math.random()
    .toString(16)
    .slice(2);
}

export function float2Int(v: number): number {
  if (v === Infinity) return Infinity
  return parseInt(`${Math.round(v + Number.EPSILON)}`);
}

export function resetBoundsWithRatio(
  bounds: HtmlElementBounds,
  ratio: number
): HtmlElementBounds {
  return ratio === 1 || !ratio
    ? bounds
    : {
        x: float2Int(bounds.x / ratio),
        y: float2Int(bounds.y / ratio),
        top: float2Int(bounds.top / ratio),
        left: float2Int(bounds.left / ratio),
        width: float2Int(bounds.width / ratio),
        height: float2Int(bounds.height / ratio),
        bottom: float2Int(bounds.bottom / ratio),
        right: float2Int(bounds.right / ratio),
      };
}

export function htmlElementBounds(
  element: HTMLElement | SVGElement
): HtmlElementBounds {
  const rect: DOMRect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
  };
}

export function withDefaultValues(target: any, defaultValues: any): any {
  const values = { ...target };
  const keys = Object.keys(defaultValues || {});
  keys.forEach((key) => (values[key] = values[key] || defaultValues[key]));
  return values;
}

export function calcAngle(opposite: number, adjacent: number) {
  return (Math.atan(opposite / adjacent) * 180) / Math.PI;
}

export function flattenToHirerarchy(nodes: Node[]): Node[] {
  if (!nodes || nodes.length === 0) {
    return [];
  }
  const nodeCopy = nodes.map((node) => {
    return {
      ...node,
      children: [],
    };
  });
  const nodeMap = {};
  nodeCopy.forEach((node) => {
    nodeMap[node.id] = node;
  });
  nodeCopy.forEach((node) => {
    if (node.parentId) {
      const parentNode = nodeMap[node.parentId];
      parentNode.children.push(node);
    }
  });
  nodeCopy.forEach((node) => {
    if (node.children.length === 0) {
      delete node.children;
    }
  });
  const hirerarchyNodes: Node[] = nodeCopy.filter((node) => !node.parentId);
  return hirerarchyNodes;
}

export function getDirection(graphLabel: dagre.GraphLabel): string {
  return NiceDagDirection[graphLabel.rankdir || "LR"];
}

export function valueWithDefault<T>(value: T, defaultValue: T): T {
  return typeof value !== "undefined" ? value : defaultValue;
}
