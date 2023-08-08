import React from 'react';

export const getRenderNode = (str: string, match: string) => {
  const regex = new RegExp(`(${match})`, 'ig'); // 使用正则进行split会保留match项在列表里
  const parts = str.split(regex);
  return (
    <span>
      {parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <span key={index} className="mark">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
};
