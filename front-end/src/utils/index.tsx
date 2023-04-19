// interface
import { AntdIcon } from '@/interface';
import { ReactElement } from 'react';

// 截取最大字符长度
export const getLimitString = (limit: number, str: string) => {
  return str.length > limit ? str.slice(0, limit) + '...' : str;
};

// 根据AtndIconList获取该图标
export const getAntdIcon: (name: string, antdIcons: AntdIcon[]) => ReactElement = (
  name: string,
  antdIcons: AntdIcon[]
) => {
  return antdIcons.filter(icon => {
    return icon.name === name;
  })[0].icon;
};

// 设置开关滚动条
export const setBodyScroll = () => {
  if (document.body.style.overflow !== 'hidden') document.body.style.overflow = 'hidden';
  else document.body.style.overflow = 'auto';
};
