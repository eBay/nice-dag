import React, { useCallback, useEffect } from 'react';
import { useNiceDag } from '@ebay/nice-dag-react';
import { HierarchicalModel } from '../data/ReadOnlyViewData';
import { FullscreenExitOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Space, Select } from 'antd';
import ZoomInOutSlider from './ZoomInOutSlider';

const Option = Select.Option;

const NODE_WIDTH = 150;
const NODE_HEIGHT = 60;
const CIRCLE_W_H = 30;

function StartNode() {
  return <div className="readonly-sample-start-node" />;
}

function EndNode() {
  return <div className="readonly-sample-end-node" />;
}

function Connector({ type }) {
  return <div className={`readonly-sample-connector-${type}`} />;
}

function Joint() {
  return <div className={`readonly-sample-joint-node`} />;
}

function GroupControl({ node }) {
  return (
    <div className="readonly-sample-node-group-content">
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
    <div className="readonly-sample-node-content">
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
    <div className="readonly-sample-node">
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
  return <div className="readonly-sample-edge-label">to</div>;
};

const renderRootView = ()=>{
  return <div className="readonly-sample-root-view">Your diagram description</div>
}

export default function ReadOnlyView() {
  const { niceDag, niceDagEl, minimapEl, render } = useNiceDag({
    initNodes: HierarchicalModel,
    getNodeSize,
    renderNode,
    renderEdge,
    renderRootView,
    minimapConfig: {
      viewBoxClassName: 'readonly-sample-minimap-viewbox',
    }
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
  const onDirectionChange = useCallback((value) => {
    niceDag.setDirection(value);
  }, [niceDag]);
  return (
    <div className="readonly-sample">
      <div>
        <Space>
          <Select defaultValue="LR" style={{ width: 120 }} onChange={onDirectionChange}>
            <Option value="LR">Left to Right</Option>
            <Option value="RL">Right to Left</Option>
            <Option value="TB">Top To Bottom</Option>
            <Option value="BT">Bottom To Top</Option>
          </Select>
          <ZoomInOutSlider onScaleChange={value => niceDag.setScale(value / 100)} />
        </Space>
      </div>
      <div className="readonly-sample-content">
        <div className="readonly-sample-content-nice-dag" ref={niceDagEl} />
        {render()}
      </div>
      <div className="readonly-sample-content-minimap-row">
        <div className="readonly-sample-content-minimap" >
            <div className="readonly-sample-content-minimap-body" ref={minimapEl} />
        </div>
      </div>
    </div>
  );
}
