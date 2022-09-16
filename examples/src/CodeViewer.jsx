/* eslint import/no-webpack-loader-syntax: off */

import React, { useEffect } from 'react';
import readOnlyViewCode from '!!raw-loader!./cases/sample/ReadOnlyView.js';
import readOnlyViewData from '!!raw-loader!./cases/data/ReadOnlyViewData.js';
import readOnlyViewLess from '!!raw-loader!./cases/sample/ReadOnlyView.less';

import editableViewCode from '!!raw-loader!./cases/sample/EditableView.js';
import editableViewLess from '!!raw-loader!./cases/sample/EditableView.less';

import complexHierarchicalViewCode from '!!raw-loader!./cases/sample/ComplexHierarchicalView.js';
import complexHierarchicalViewData from '!!raw-loader!./cases/data/ComplexHierarchicalViewData.js';
import complexHierarchicalViewLess from '!!raw-loader!./cases/sample/ComplexHierarchicalView.less';

import zoomInOutSliderCode from '!!raw-loader!./cases/sample/ZoomInOutSlider.js';

const codeMap = {
  'ReadOnlyView.js': readOnlyViewCode,
  'ReadOnlyViewData.js': readOnlyViewData,
  'ReadOnlyView.less': readOnlyViewLess,
  'EditableView.js': editableViewCode,
  'ZoomInOutSlider.js': zoomInOutSliderCode,
  'EditableView.less': editableViewLess,
  'ComplexHierarchicalView.js': complexHierarchicalViewCode,
  'ComplexHierarchicalView.less': complexHierarchicalViewLess,
  'ComplexHierarchicalViewData.js': complexHierarchicalViewData
};
export default function CodeViewer({ filename }) {
  useEffect(() => {
    if (window.Prism) window.Prism.highlightAll();
  }, [filename]);
  return (
    <pre>
      <code className="language-jsx line-numbers">
        {codeMap[filename] || `// Error: code of "${filename}" not found`}
      </code>
    </pre>
  );
}
