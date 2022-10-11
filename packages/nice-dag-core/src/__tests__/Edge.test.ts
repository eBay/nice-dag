import Edge from "../Edge"
import ViewNode from "../ViewNode";
import { IViewModel, Node, ViewNodeChangeEvent, ViewNodeChangeEventType } from '../types';
import { createViewModel, initNiceDagHolder } from "./mockFactory";

describe('Edge should work correctly', () => {

    beforeAll(() => {
        initNiceDagHolder();
    });


    it('destory should clear all reference', () => {
        const sourceNode: Node = {
            id: 'from'
        };
        const toNode: Node = {
            id: 'to'
        };
        const viewModel: IViewModel = createViewModel({
            id: 'edge-test', nodes: [sourceNode, toNode], isRootModel: true
        });
        const source = new ViewNode(sourceNode, false, viewModel);
        const to = new ViewNode(toNode, false, viewModel);
        const edge = new Edge(source, to);
        //test destory
        edge.destory();

        expect(edge.source).toBeNull();
        expect(edge.target).toBeNull();
        expect(edge.pathRef).toBeNull();
        expect(edge.ref).toBeNull();
    });

    it('onNodeChange should be called when source node fire event POSITION_CHANGE|RESIZE|EXPAND_NODE|SHRINK_NODE', () => {
        const sourceNode: Node = {
            id: 'from'
        };
        const toNode: Node = {
            id: 'to'
        };
        const viewModel: IViewModel = createViewModel({
            id: 'edge-test', nodes: [sourceNode, toNode], isRootModel: true
        });
        const source = new ViewNode(sourceNode, false, viewModel);
        const to = new ViewNode(toNode, false, viewModel);
        const edge = new Edge(source, to);
        let calls = 0;
        edge.doLayout = () => {
            calls++;
        };
        let event: ViewNodeChangeEvent = {
            type: ViewNodeChangeEventType.POSITION_CHANGE,
            node: source
        };
        source.fireNodeChange(event);

        event = {
            type: ViewNodeChangeEventType.RESIZE,
            node: source
        };
        source.fireNodeChange(event);
        event = {
            type: ViewNodeChangeEventType.EXPAND_NODE,
            node: source
        };
        source.fireNodeChange(event);
        event = {
            type: ViewNodeChangeEventType.SHRINK_NODE,
            node: source
        };
        source.fireNodeChange(event);
        expect(calls).toBe(4);
    });

    it('onNodeChange should be called when source node fire event POSITION_CHANGE|RESIZE|EXPAND_NODE|SHRINK_NODE', () => {
        const sourceNode: Node = {
            id: 'from'
        };
        const toNode: Node = {
            id: 'to'
        };
        const viewModel: IViewModel = createViewModel({
            id: 'edge-test', nodes: [sourceNode, toNode], isRootModel: true
        });
        const source = new ViewNode(sourceNode, false, viewModel);
        const to = new ViewNode(toNode, false, viewModel);
        const edge = new Edge(source, to);
        let calls = 0;
        edge.doLayout = () => {
            calls++;
        };
        let event: ViewNodeChangeEvent = {
            type: ViewNodeChangeEventType.POSITION_CHANGE,
            node: source
        };
        source.fireNodeChange(event);

        event = {
            type: ViewNodeChangeEventType.RESIZE,
            node: source
        };
        source.fireNodeChange(event);
        event = {
            type: ViewNodeChangeEventType.EXPAND_NODE,
            node: source
        };
        source.fireNodeChange(event);
        event = {
            type: ViewNodeChangeEventType.SHRINK_NODE,
            node: source
        };
        source.fireNodeChange(event);
        expect(calls).toBe(4);
    })

    it('onNodeChange should be called when source node fire event REMOVED', () => {
        const sourceNode: Node = {
            id: 'from'
        };
        const toNode: Node = {
            id: 'to'
        };
        const viewModel: IViewModel = createViewModel({
            id: 'edge-test', nodes: [sourceNode, toNode], isRootModel: true
        });
        const source = new ViewNode(sourceNode, false, viewModel);
        const to = new ViewNode(toNode, false, viewModel);
        const edge = new Edge(source, to);
        let calls = 0;
        edge.remove = () => {
            calls++;
        };
        let event = {
            type: ViewNodeChangeEventType.REMOVED,
            node: source
        };
        source.fireNodeChange(event);

        expect(calls).toBe(1);
        expect(edge.source).toBeNull();
        expect(edge.target).toBeNull();
        expect(edge.pathRef).toBeNull();
        expect(edge.ref).toBeNull();
    })
})

