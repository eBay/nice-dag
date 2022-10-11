import React, { useEffect } from 'react';
import { useNiceDag } from '@ebay/nice-dag-react';
import { ComplexFlattenModel } from '../data/ComplexHierarchicalViewData';
import { FullscreenExitOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import ZoomInOutSlider from './ZoomInOutSlider';

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const CIRCLE_W_H = 30;

function StartNode() {
  return <div className="complex-sample-start-node" />;
}

function EndNode() {
  return <div className="complex-sample-end-node" />;
}

function Connector({ type }) {
  return <div className={`complex-sample-connector-${type}`} />;
}

function Joint() {
  return <div className={`complex-sample-joint-node`} />;
}

function GroupControl({ node }) {
  return (
    <div className="complex-sample-node-group-content">
      <div>
        {node.data?.label || node.id}
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

function NodeControl({ node }) {
  return (
    <div className="complex-sample-node-content">
      <span>{node.data?.label || node.id}</span>
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
    <div className="complex-sample-node">
      {node.children?.length > 0 && !node.collapse ? (
        <GroupControl node={node} niceDag={niceDag} />
      ) : (
        <NodeControl node={node} niceDag={niceDag} />
      )}
      <Connector type="in" />
      <Connector type="out" />
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

const renderEdge = ({ edge, niceDag }) => {
  return <div className="complex-sample-edge-label">to</div>;
};

function mapEdgeToPoints(edge) {
  const { source, target } = edge;
  let edgeSource = {
    x: source.x + source.width,
    y: source.y + source.height / 2,
  };
  let edgeTarget = {
    x: target.x,
    y: target.y + target.height / 2,
  };
  if (source.joint || source.id.indexOf('start') !== -1) {
    edgeSource = {
      x: source.x + source.width / 2,
      y: source.y + source.height / 2,
    };
  } else if (target.joint || target.id.indexOf('end') !== -1) {
    edgeTarget = {
      x: target.x + target.width / 2,
      y: target.y + target.height / 2,
    };
  }
  return {
    source: edgeSource,
    target: edgeTarget,
  };
}

export default function ComplexView() {
  const { niceDag, niceDagEl, render } = useNiceDag({
    initNodes: ComplexFlattenModel,
    modelType: 'FLATTEN',
    getNodeSize,
    renderNode,
    mapEdgeToPoints,
    renderEdge,
  });
  useEffect(() => {
    if (niceDag) {
      const bounds = niceDagEl.current.getBoundingClientRect();
      niceDag.center({
        width: bounds.width,
        height: 400,
      });
    }
  }, [niceDag, niceDagEl]);
  return (
    <div className="complex-sample">
      <div>
        <Space>
          <ZoomInOutSlider onScaleChange={value => niceDag.setScale(value / 100)} />
        </Space>
      </div>
      <div className="complex-sample-nice-dag-wrapper" ref={niceDagEl} />
      {render()}
    </div>
  );
}
