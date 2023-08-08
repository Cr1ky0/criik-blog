import React from 'react';

export const getRenderNode = (str: string, match: string) => {
  const list = str.split(match);
  // 奇数项插入match（最大长度后面不插入）
  const newList: string[] = [];
  list.forEach((str, index) => {
    newList.push(str);
    if (index !== list.length - 1) {
      newList.push(match);
    }
  });
  return newList.map((str, index) => {
    if (str === match) {
      return (
        <span key={index} className="mark">
          {str}
        </span>
      );
    } else return <span key={index}>{str}</span>;
  });
};
