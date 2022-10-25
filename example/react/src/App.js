import useHash from './useHash';
import CodeViewer from './CodeViewer';
import { Tabs } from 'antd';
import React from 'react';
import ReadOnlyView from './cases/sample/ReadOnlyView';
import EditableView from './cases/sample/EditableView';
import ComplexHierarchicalView from './cases/sample/ComplexHierarchicalView';
import LogoSvg from './assets/svgs/logo.svg';

const { TabPane } = Tabs;

const examples = {
  'read-only-view': {
    name: 'Read-Only View',
    component: <ReadOnlyView />,
    code: ['ReadOnlyView.js', 'ZoomInOutSlider.js'],
    less: 'ReadOnlyView.less',
    data: 'ReadOnlyViewData.js',
  },
  'editable-view': {
    name: 'Editable View',
    component: <EditableView />,
    code: ['EditableView.js', 'ZoomInOutSlider.js'],
    less: 'EditableView.less',
    data: 'ReadOnlyViewData.js',
  },
  'complex-structure-view': {
    name: 'Complex Structure View',
    component: <ComplexHierarchicalView />,
    code: ['ComplexHierarchicalView.js', 'ZoomInOutSlider.js'],
    less: 'ComplexHierarchicalView.less',
    data: 'ComplexHierarchicalViewData.js',
  }
};

function App() {
  const current = useHash() || 'read-only-view';
  const renderExample = () => {
    const item = examples[current];
    if (!item || !item.component) {
      return <span style={{ color: 'red' }}>Error: example "{current}" not found.</span>;
    }
    return (
      <>
        <h2>{item.name}</h2>
        <div className="example-container">{item.component}</div>{' '}
      </>
    );
  };

  const example = examples[current] || {};
  const ele = (
    <div className="app">
      <div className="sider">
        <h1>
          <img src={LogoSvg} alt="" height={28} width={28} />
          <div className="header-info">
            <span className="example-title">React Example</span>
            <span className="header-name">@ebay/nice-dag-react</span>
          </div>
        </h1>
        <div className="scroll-container" id="scroll-container">
          <ul>
            {Object.keys(examples).map(key => (
              <li key={key}>
                <a href={`#${key}`} className={current === key ? 'active' : ''}>
                  {examples[key].name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-info">
          <span className="footer-label">Other Reference</span>
          <a href="../vue/index.html#read-only-view">Vue.js Example</a>
        </div>
      </div>
      <div className="sample-content">
        {renderExample()}
        <div className="code-container">
          <Tabs defaultActiveKey="tab-code">
            <TabPane tab="Code" key="tab-code">
              {example.code.map(f => <div className="code-viewer" key={f}>
                <div className="code-viewer-title">{f}</div>
                <CodeViewer filename={f} />
              </div>)}
            </TabPane>
            <TabPane tab="Less" key="tab-less">
              <CodeViewer filename={example.less} />
            </TabPane>
            <TabPane tab="Data" key="tab-data">
              <CodeViewer filename={example.data} />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );

  if (current === 'redux') return ele;
  else return <div className="example-container">{ele}</div>;
}

export default App;