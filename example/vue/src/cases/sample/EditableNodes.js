import ShrinkSvg from '../../assets/svgs/shrink.vue';
import PlusSvg from '../../assets/svgs/plus.vue';
import MoveSvg from '../../assets/svgs/move.vue';
import MyButton from '../../components/MyButton.vue';

export const StartNode = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  render() {
    return <div className="editable-sample-start-node">
      <div className="editable-sample-start-node-move-hand" onMouseDown={startNodeDragging} />
      <SquareConnector type="out" node={node} niceDag={niceDag} />
    </div>
  }
}

export const EndNode = <div className="readonly-sample-end-node" />;

export const SquareConnector = {
  props: ['type', 'node', 'niceDag'],
  render() {
    this.niceDag.startEdgeDragging(node, e);
    const { startEdgeDragging } = useNiceDagNode({ node, niceDag });
    return (
      <div className={`editable-sample-square-connector-${type}`} onMouseDown={startEdgeDragging} />
    );
  }
}

export const Connector = {
  props: ['type', 'node', 'niceDag'],
  emits: ['update:type', 'update:node', 'update:niceDag'],
  render() {
    return (
      <div className={`readonly-sample-connector-${this.type}`}>
      </div>
    );
  }
};

export const Joint = <div className="readonly-sample-joint-node" />;

const GroupControl = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  components: [ShrinkSvg, MyButton],
  render() {
    return (<div className="readonly-sample-node-group-content">
      <div>
        {this.node.data?.label || this.node.id}
        <MyButton onClick={() => this.node.shrink()}>
          <ShrinkSvg />
        </MyButton>
      </div>
    </div>);
  }
}

const NodeControl = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  render() {
    return (
      <div className="readonly-sample-node-content">
        <span>{this.node.data?.label || this.node.id}</span>
        {this.niceDag.editing && <MoveSvg />}
        {(this.node.children?.length > 0 || this.node.data?.lazyLoadingChildren) && (
          <MyButton onClick={() => {
            if (this.node.data?.lazyLoadingChildren) {
              this.node.withChildren(new Promise((resolve) => {
                resolve([{
                  id: 'step-1',
                }, {
                  id: 'step-2',
                  dependencies: ['step-1']
                }])
              }));
            } else {
              this.node.expand();
            }
          }}>
            <PlusSvg />
          </MyButton>
        )}
      </div>
    );
  }
};

export const Edge = {
  render() {
    return <div className="readonly-sample-edge-label">to</div>;
  }
}

export const SampleNode = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  render() {
    return (
      <div className="readonly-sample-node">
        {this.node.children?.length > 0 && !this.node.collapse ? (
          <GroupControl node={this.node} niceDag={this.niceDag} />
        ) : (
          <NodeControl node={this.node} niceDag={this.niceDag} />
        )}
        <Connector type="in" />
        <Connector type="out" />
      </div>
    );
  }
};