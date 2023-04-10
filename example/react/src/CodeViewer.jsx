/* eslint import/no-webpack-loader-syntax: off */

import React from 'react';
import readOnlyViewCode from '!!raw-loader!./cases/sample/ReadOnlyView.js';
import readOnlyViewData from '!!raw-loader!./cases/data/ReadOnlyViewData.js';
import readOnlyViewLess from '!!raw-loader!./cases/sample/ReadOnlyView.less';

import editableViewCode from '!!raw-loader!./cases/sample/EditableView.js';
import editableViewLess from '!!raw-loader!./cases/sample/EditableView.less';

import complexHierarchicalViewCode from '!!raw-loader!./cases/sample/ComplexHierarchicalView.js';
import complexHierarchicalViewData from '!!raw-loader!./cases/data/ComplexHierarchicalViewData.js';
import complexHierarchicalViewLess from '!!raw-loader!./cases/sample/ComplexHierarchicalView.less';

import zoomInOutSliderCode from '!!raw-loader!./cases/sample/ZoomInOutSlider.js';

import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import styled from "styled-components";

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
const Pre = styled.pre`
  text-align: left;
  margin: 0 0 !important;
  padding: 0.5em;
  overflow: scroll;
`;

const Line = styled.div`
  display: table-row;
`;

const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`;

const LineContent = styled.span`
  display: table-cell;
`;

export default function CodeViewer({ filename }) {
  return <Highlight {...defaultProps} theme={theme} code={codeMap[filename] || `// Error: code of "${filename}" not found`} language="jsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <Pre className={className} style={style}>
        {tokens.map((line, i) => (
          <Line key={i} {...getLineProps({ line, key: i })}>
            <LineNo>{i + 1}</LineNo>
            <LineContent>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </LineContent>
          </Line>
        ))}
      </Pre>
    )}
  </Highlight>;
}
