import React, { useEffect, useState, useRef, MutableRefObject, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import NiceDag from '@ebay/nice-dag-core';
import NiceDagTypes, { IEdge, MinimapConfig } from '@ebay/nice-dag-core/lib/types';

export type UseNiceDagArgs = Omit<NiceDagTypes.NiceDagInitArgs, 'container'> & {
    renderNode: (props: NiceDagNodeProps) => React.Component<any, any, any>;
    renderEdge?: (props: NiceDagEdgeProps) => React.Component<any, any, any>;
    renderRootView?: (niceDag: NiceDagTypes.NiceDag) => React.Component<any, any, any>;
    scrollPosition?: NiceDagTypes.Point;
    initNodes?: NiceDagTypes.Node[];
    onMount?: () => void;
    editable?: boolean;
    minimapConfig?: MinimapConfig;
};

type RenderNodeType = UseNiceDagArgs['renderNode'];
type RenderEdgeType = UseNiceDagArgs['renderEdge'];

export type UseNiceDagType = {
    niceDagEl: MutableRefObject<any>;
    minimapEl: MutableRefObject<any>;
    niceDag: NiceDagTypes.NiceDag;
    render: () => JSX.Element[];
    reset: () => void;
};

export interface NiceDagNodeProps {
    node: NiceDagTypes.IViewNode,
    render: RenderNodeType;
    niceDag: NiceDagTypes.NiceDag;
    patchVersion: number;
}

export interface NiceDagEdgeProps {
    niceDag: NiceDagTypes.NiceDag;
    edge: NiceDagTypes.IEdge,
    render: RenderEdgeType;
    patchVersion: number;
}

export interface NiceDagRootViewProps {
    niceDag: NiceDagTypes.NiceDag;
    render: (niceDag: NiceDagTypes.NiceDag) => React.Component<any, any, any>;
}

export class NiceDagNode extends React.Component<NiceDagNodeProps, any> {

    render() {
        if (this.props.niceDag && this.props.node.ref) {
            const domRef = this.props.niceDag.getElementByNodeId(this.props.node.id);
            if (domRef) {
                return ReactDOM.createPortal(
                    <>{this.props.render(this.props)}</>,
                    domRef,
                );
            }
        }
        return null;
    }
};

export class NiceDagEdge extends React.Component<NiceDagEdgeProps, any> {

    render() {
        if (this.props.niceDag && this.props.edge.ref) {
            return ReactDOM.createPortal(
                <>{this.props.render(this.props)}</>,
                this.props.edge.ref,
            );
        }
        return null;
    }
};

class NiceDagRootView extends React.Component<NiceDagRootViewProps, any> {

    render() {
        if (this.props.niceDag) {
            const elm = this.props.niceDag.getRootContentElement();
            return ReactDOM.createPortal(
                <>{this.props.render(this.props.niceDag)}</>,
                elm,
            );
        }
        return null;
    }
};

export type DagViewProps = Omit<NiceDagTypes.NiceDagInitArgs, 'container'> & {
    initNodes?: NiceDagTypes.Node[];
    renderHeader: () => React.Component<any, any>;
    renderFooter: () => React.Component<any, any>;
    renderNode: (props: NiceDagNodeProps) => React.Component<any, any>;
    onMount?: () => void;
    editable?: boolean;
}

export function useNiceDagEdge(edge: IEdge): { onEdgeRemove: () => void, onNodeInsert: (nodes: NiceDagTypes.Node[], offset: number) => void } {
    const onEdgeRemove = useCallback(
        (): void => {
            edge.remove();
        },
        [edge],
    );
    const onNodeInsert = useCallback(
        (nodes: NiceDagTypes.Node[], offset: number = 40): void => {
            edge.insertNodes(nodes, offset);
        },
        [edge],
    );
    return { onEdgeRemove, onNodeInsert };
}

export function useNiceDagNode({ node, niceDag }:
    { node: NiceDagTypes.IViewNode, niceDag: NiceDagTypes.IWritableNiceDag })
    : { onNodeRemove: () => void, startEdgeDragging: (e: MouseEvent) => void, startNodeDragging: (e: MouseEvent) => void } {
    const onNodeRemove = useCallback(
        (): void => {
            node.remove();
        },
        [node],
    );
    const startEdgeDragging = useCallback(
        (e: MouseEvent): void => {
            niceDag.startEdgeDragging(node, e);
        },
        [niceDag, node],
    );

    const startNodeDragging = useCallback(
        (e: MouseEvent): void => {
            niceDag.startNodeDragging(node, e);
        },
        [niceDag, node],
    );
    return { onNodeRemove, startEdgeDragging, startNodeDragging };
}

function validateProps(args: UseNiceDagArgs): void {
    const { initNodes } = args;
    if (!initNodes) {
        throw new Error(`initNodes can't be undefined!`);
    }
}

export function useNiceDag(args: UseNiceDagArgs): UseNiceDagType {
    validateProps(args);
    const { onMount, renderNode, renderRootView, renderEdge, scrollPosition, initNodes, minimapConfig, ...niceDagConfig } = args;
    const niceDagEl = useRef(null);
    const minimapEl = useRef(null);
    const niceDagRef = useRef<NiceDagTypes.NiceDag>(null);
    const prevInitNodesRef = useRef<NiceDagTypes.Node[]>();
    const [patchVersion, setPatchVersion] = useState<number>(0);
    const reset = useCallback(() => {
        if (niceDagRef.current) {
            niceDagRef.current.destory();
        }
    }, [setPatchVersion]);
    const onNiceDagChange = useMemo(() => {
        return {
            onChange: () => {
                setPatchVersion(patchVersion + 1);
            }
        }
    }, [setPatchVersion, patchVersion]);
    useEffect(() => {
        if (prevInitNodesRef.current !== initNodes) {
            if (!niceDagRef.current) {
                const niceDag = NiceDag.init({
                    container: niceDagEl.current,
                    minimapContainer: minimapEl.current,
                    minimapConfig,
                    ...niceDagConfig,
                }, args.editable);
                niceDagRef.current = niceDag;
            }
            niceDagRef.current.withNodes(initNodes).render();
            setPatchVersion(patchVersion + 1);
            prevInitNodesRef.current = initNodes;
            onMount && onMount();
        }
        /**
         * Add listener here is to pass onChange closure variables "patchVersion"
         */
        niceDagRef.current.addNiceDagChangeListener(onNiceDagChange);
        return () => {
            niceDagRef.current.removeNiceDagChangeListener(onNiceDagChange);
        }
    }, [initNodes, setPatchVersion, patchVersion, onMount]);
    /**
     * Just clean when the component is removed
     */
    useEffect(() => {
        if (niceDagRef.current && niceDagRef.current.isDestoried) {
            niceDagRef.current.withNodes(initNodes).render();
            setPatchVersion(patchVersion + 1);
        }
        return () => {
            if (niceDagRef.current) {
                niceDagRef.current.destory();
            }
        }
    }, []);
    return {
        niceDag: niceDagRef.current,
        niceDagEl,
        minimapEl,
        render: () => {
            if (niceDagRef.current) {
                const allNodes: NiceDagTypes.IViewNode[] = niceDagRef.current.getAllNodes();
                let elements = allNodes?.length > 0 ? allNodes.map(node => <NiceDagNode
                    render={renderNode}
                    node={node}
                    key={node.id}
                    niceDag={niceDagRef.current}
                    patchVersion={patchVersion}
                />) : null;
                if (renderRootView) {
                    elements = [...elements, <NiceDagRootView key="root-view" niceDag={(niceDagRef.current)} render={renderRootView} />];
                }
                if (renderEdge) {
                    const allEdges: NiceDagTypes.IEdge[] = niceDagRef.current.getAllEdges();
                    const edgeElements = allEdges?.length > 0 ? allEdges.map(edge =>
                        <NiceDagEdge render={renderEdge} edge={edge}
                            patchVersion={patchVersion}
                            key={`edge-${edge.source.id}-${edge.target.id}`}
                            niceDag={niceDagRef.current} />) : [];
                    elements = [...elements, ...edgeElements];
                }
                return elements;
            }
            return null;
        },
        reset
    };
}

