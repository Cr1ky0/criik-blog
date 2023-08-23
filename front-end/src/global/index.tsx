import { Tag } from 'antd';
import React from 'react';

export const THEME_COLOR = '#5c92d1';
export const BREAK_POINT = 768;

// dark mode
export const BACKGROUND_COLOR_DARK = '#0d1117';
export const BACKGROUND_COLOR_DARK_2 = '#161b22';
export const FONT_COLOR_DARK = '#9e9e9e';

export const FONT_COLOR_LIGHT = '#2c3e50';

export const FONT_COLOR_LIGHT_2 = 'rgba(0,0,0,.4)';

export const BASE_URL = 'https://www.criiky0.top';
// export const BASE_URL = 'http://localhost:3002';
export const ANIME_HIDE_TIME = 300; // 延迟跳转或dispatch时间（用于selectedID）

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
