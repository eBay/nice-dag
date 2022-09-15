import React, { useState, useCallback } from 'react';
import { Slider, Space } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons';

export default function ZoomInOutSlider({ onScaleChange }) {
  const [scale, setScale] = useState(100);
  const onSlideValueChange = useCallback(
    value => {
      setScale(value);
      onScaleChange(value);
    },
    [onScaleChange],
  );
  return (
    <Space>
      <ZoomOutOutlined />
      <Slider defaultValue={scale} onChange={onSlideValueChange} />
      <ZoomInOutlined />
    </Space>
  );
}
