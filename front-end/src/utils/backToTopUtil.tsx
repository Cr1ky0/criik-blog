import React from 'react';

// click event
export const backToTop = (node: HTMLElement) => {
  node.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// 节流闭包函数
export const throttle = (
  current: HTMLElement,
  child: HTMLElement,
  setScrollHeight: React.Dispatch<number>,
  setScrollTop: React.Dispatch<number>
) => {
  let valid = true;
  return () => {
    if (valid) {
      setTimeout(() => {
        // 逻辑处理
        // 总滚动大小 = 总滚动高度 - 视图大小
        if (current.scrollTop !== 0) {
          child.style.visibility = 'visible';
          child.style.opacity = '1';
        } else {
          child.style.visibility = 'hidden';
          child.style.opacity = '0';
        }
        setScrollHeight(current.scrollHeight - current.offsetHeight);
        setScrollTop(current.scrollTop);
        valid = true;
      }, 500);
      valid = false;
    }
  };
};
