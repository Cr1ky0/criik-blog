import { Tag } from 'antd';
import React from 'react';

export const THEME_COLOR = '#5c92d1';
export const BREAK_POINT = 768;

// dark mode
export const BACKGROUND_COLOR_DARK_2 = '#161b22';
export const FONT_COLOR_DARK = '#9e9e9e';

// export const BASE_URL = 'https://www.criiky0.top';
export const BASE_URL = 'http://localhost:3002';

// 颜色选项
export const colorList = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

export const colorChoseList = colorList.map(color => ({
  value: color,
  label: (
    <>
      <Tag color={color}>{color}</Tag>
    </>
  ),
}));
