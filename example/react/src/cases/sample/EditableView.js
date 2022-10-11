import React, { useCallback, useEffect } from 'react';
import { useNiceDag, useNiceDagNode, useNiceDagEdge } from '@ebay/nice-dag-react';
import { HierarchicalModel } from '../data/ReadOnlyViewData';
import {
  FullscreenExitOutlined,
  PlusCircleOutlined,
  DragOutlined,
  CloseCircleOutlined,
  CloseOutlined
} from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';
import ZoomInOutSlider from './ZoomInOutSlider';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const CIRCLE_W_H = 30;

function StartNode({ node, niceDag }) {
  const { startNodeDragging } = useNiceDagNode({ node, niceDag });
  return (
    <div className="editable-sample-start-node">
      <div className="editable-sample-start-node-move-hand" onMouseDown={startNodeDragging} />
      <SquareConnector type="out" node={node} niceDag={niceDag} />
    </div>
  );
}

function EndNode({ node, niceDag }) {
  const { startNodeDragging } = useNiceDagNode({ node, niceDag });
  return (
    <div className="editable-sample-end-node" onMouseDown={startNodeDragging}>
      <SquareConnector type="in" />
    </div>
  );
}

let nodeCtnRef = 0;
function Edge({ edge }) {
  const { onEdgeRemove, onNodeInsert } = useNiceDagEdge(edge);
  const runInsertBetween = useCallback(() => {
    onNodeInsert([
      {
        'id': `insert-node-${nodeCtnRef}`
      },
      {
        'id': `insert-node-${nodeCtnRef + 1}`
      },
      {
        'id': `insert-node-${nodeCtnRef + 2}`
      }
    ]);
    nodeCtnRef += 3;
  }, [onNodeInsert]);
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <span onClick={onEdgeRemove}>Remove</span>,
        },
        {
          key: '2',
          label: <span onClick={runInsertBetween}>Insert Tasks</span>,
        },
      ]}
    />
  );
  return (
    <div className="editable-sample-edge-label">
      <Dropdown overlay={menu}>
        <div />
      </Dropdown>
    </div>
  );
}

const renderEdge = props => {
  return <Edge {...props} />;
};

function Connector({ type, niceDag, node }) {
  const { startEdgeDragging } = useNiceDagNode({ node, niceDag });
  return <div className={`editable-sample-connector-${type}`} onMouseDown={startEdgeDragging}
    aria-label={`${type === 'in' ? 'Inbound' : 'Outbound'}Connector`} role="button" />
}

function SquareConnector({ type, niceDag, node }) {
  const { startEdgeDragging } = useNiceDagNode({ node, niceDag });
  return (
    <div className={`editable-sample-square-connector-${type}`} onMouseDown={startEdgeDragging} />
  );
}

function Joint({ node, niceDag }) {
  const { onNodeRemove, startNodeDragging } = useNiceDagNode({ node, niceDag });
  return <div className="editable-sample-joint-node">
    <div className="editable-sample-joint-node-move" onMouseDown={startNodeDragging}>
      <DragOutlined />
    </div>
    <div
      className="editable-sample-joint-node-remove-button"
      role="button"
      onMouseDown={onNodeRemove}
      aria-label="Remove joint node"
    >
      <CloseOutlined />
    </div>
    <SquareConnector type="in" />
    <SquareConnector type="out" node={node} niceDag={niceDag} />
  </div>;
}

function GroupControl({ node, niceDag }) {
  const { onNodeRemove, startNodeDragging } = useNiceDagNode({ node, niceDag });
  return (
    <div className="editable-sample-node-group-content">
      <div>
        <div className="editable-sample-node-group-content-bar" onMouseDown={startNodeDragging}>
          <span>{node.data?.label || node.id}</span>
          <DragOutlined />
        </div>
        <div
          className="editable-sample-node-group-content-delete-button"
          role="button"
          onMouseDown={onNodeRemove}
        >
          <CloseCircleOutlined />
        </div>
        <Button
          icon={<FullscreenExitOutlined />}
          onClick={() => {
            node.shrink();
          }}
          type="link"
        />
      </div>
    </div>
  );
}

function NodeControl({ node, niceDag }) {
  const { onNodeRemove, startNodeDragging } = useNiceDagNode({ node, niceDag });
  return (
    <div className="editable-sample-node-content">
      <div className="editable-sample-node-content-bar" onMouseDown={startNodeDragging}>
        <span>{node.data?.label || node.id}</span>
        <DragOutlined />
      </div>
      <div
        className="editable-sample-node-content-delete-button"
        role="button"
        onMouseDown={onNodeRemove}
      >
        <CloseCircleOutlined />
      </div>
      {(node.children?.length > 0 || node.data?.lazyLoadingChildren) && (
        <Button
          icon={<PlusCircleOutlined />}
          onClick={() => {
            if (node.data?.lazyLoadingChildren) {
              node.withChildren(new Promise((resolve) => {
                resolve([{
                  id: 'step-1',
                }, {
                  id: 'step-2',
                  dependencies: ['step-1']
                }])
              }));
            } else {
              node.expand();
            }
          }}
          type="link"
        />
      )}
    </div>
  );
}

function SampleNode({ node, niceDag }) {
  return (
    <div className="editable-sample-node">
      {node.children?.length > 0 && !node.collapse ? (
        <GroupControl node={node} niceDag={niceDag} />
      ) : (
        <NodeControl node={node} niceDag={niceDag} />
      )}
      <Connector type="in" />
      <Connector type="out" node={node} niceDag={niceDag} />
    </div>
  );
}

const getNodeSize = node => {
  if (node.id === 'start' || node.id === 'end' || node.joint) {
    return {
      width: CIRCLE_W_H,
      height: CIRCLE_W_H,
    };
  }
  return {
    width: NODE_WIDTH,
    height: NODE_HEIGHT,
  };
};

const NODE_COMP_MAPPER = {
  start: StartNode,
  end: EndNode,
};

const renderNode = ({ node, niceDag }) => {
  let Comp = NODE_COMP_MAPPER[node.id] || SampleNode;
  if (node.joint) {
    Comp = Joint;
  }
  return <Comp node={node} niceDag={niceDag} />;
};

export default function EditableDagView() {
  const { niceDag, niceDagEl, render } = useNiceDag({
    initNodes: HierarchicalModel,
    getNodeSize,
    renderNode,
    editable: true,
    renderEdge,
    jointEdgeConnectorType: 'CENTER_OF_BORDER'
  });
  useEffect(() => {
    if (niceDag) {
      const bounds = document.querySelector('.editable-sample').getBoundingClientRect();
      niceDag
        .center({
          width: bounds.width,
          height: 400,
        })
        .startEditing();
    }
  }, [niceDag]);
  return (
    <div className="editable-sample">
      <div>
        <Space>
          <Button
            size="small"
            onClick={() => {
              niceDag.prettify();
            }}
          >
            Prettify
          </Button>
          <Button
            size="small"
            onClick={() => {
              niceDag.addNode({
                id: `new-node-${nodeCtnRef}`,
              }, {
                x: 40,
                y: 40
              });
              nodeCtnRef = nodeCtnRef + 1;
            }}
          >
            Add Node
          </Button>
          <Button
            size="small"
            onClick={() => {
              niceDag.addJointNode({
                id: `new-node-${nodeCtnRef}`
              }, {
                x: 40,
                y: 40
              });
              nodeCtnRef = nodeCtnRef + 1;
            }}
          >
            Add Joint Node
          </Button>
          <ZoomInOutSlider onScaleChange={value => niceDag.setScale(value / 100)} />
        </Space>
      </div>
      <div className="editable-sample-nice-dag-wrapper" ref={niceDagEl} />
      {render()}
    </div>
  );
}
