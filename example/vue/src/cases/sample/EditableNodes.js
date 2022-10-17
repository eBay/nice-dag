import ShrinkSvg from '../../assets/svgs/shrink.vue';
import PlusSvg from '../../assets/svgs/plus.vue';
import MoveSvg from '../../assets/svgs/move.vue';
import MyButton from '../../components/MyButton.vue';
import SvgIcon from "../../components/SvgIcon.vue";

export const StartNode = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  render() {
    return <div className="editable-sample-start-node">
      <div className="editable-sample-start-node-move-hand"
        onMouseDown={(e) => {
          console.log('click down', e)
          // this.niceDag.startNodeDragging(this.node, e);
        }}
      />
      <SquareConnector type="out" node={this.node} niceDag={this.niceDag} />
    </div>
  }
}

export const EndNode = <div className="editable-sample-end-node" />;

export const SquareConnector = {
  props: ['type', 'node', 'niceDag'],
  emits: ['update:node', 'update:niceDag', 'update:type'],
  render() {
    return (
      <div className={`editable-sample-square-connector-${this.type}`} onMouseDown={(e) => {
        this.niceDag.startEdgeDragging(this.node, e);
      }} />
    );
  }
}

export const Connector = {
  props: ['type', 'node', 'niceDag'],
  emits: ['update:type', 'update:node', 'update:niceDag'],
  render() {
    return (
      <div className={`editable-sample-connector-${this.type}`} onMouseDown={(e) => {
        this.niceDag.startEdgeDragging(this.node, e);
      }}>
      </div>
    );
  }
};

export const Joint = <div className="editable-sample-joint-node" />;

const GroupControl = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  components: [ShrinkSvg, MyButton],
  render() {
    return (<div className="editable-sample-node-group-content">
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
  components: [SvgIcon, MoveSvg],
  render() {
    return (
      <div className="editable-sample-node-content">
        <div className="editable-sample-node-content-bar" onMousedown={(e) => {
          this.niceDag.startNodeDragging(this.node, e);
        }}>
          <span>{this.node.data?.label || this.node.id}</span>
          {this.niceDag.editing && <SvgIcon><MoveSvg /></SvgIcon>}
        </div>
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
    return <div className="editable-sample-edge-label"></div>;
  }
}

export const SampleNode = {
  props: ['node', 'niceDag'],
  emits: ['update:node', 'update:niceDag'],
  render() {
    return (
      <div className="editable-sample-node">
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