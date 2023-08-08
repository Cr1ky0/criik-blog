import React from 'react';
import { THEME_COLOR } from '@/global';

export const getRenderNode = (str: string, match: string) => {
  const regex = new RegExp(`(${match})`, 'ig'); // 使用正则进行split会保留match项在列表里
  const parts = str.split(regex);
  return (
    <span>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <span key={index} style={{ color: THEME_COLOR }}>
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};
