// interface
import { AntdIcon, MenuItem, SideMenuItem } from '@/interface';
import { ReactElement } from 'react';
import type { DataNode } from 'antd/es/tree';

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

export const isNoScroll = () => {
  return document.body.style.overflow === 'hidden';
};

// 根据key获得其在SideMenuList的层级
export const getGrade: (menus: SideMenuItem[], key: string) => number | undefined = (menus, key) => {
  const filter = menus.filter(menu => menu.key === key);
  if (filter[0]) return filter[0].grade;
  for (let i = 0; i < menus.length; i += 1) {
    if (menus[i].children) return getGrade(menus[i].children as SideMenuItem[], key);
  }
};

// 将SideMenuItem列表转化为MenuItem列表
function getItem(label: string, key?: React.Key | null, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 根据SideMenuItem[]获取antdSideMenu规范的Menu
export const getAntdMenus: (menus: SideMenuItem[], icons: AntdIcon[]) => MenuItem[] = (menus, icons) => {
  // 改写递归，可以套n层
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    return getItem(
      menu.label,
      menu.key,
      icon[0] ? icon[0].icon : undefined,
      menu.children ? getAntdMenus(menu.children, icons) : undefined
    );
  });
};

// 根据SideMenuItem[]获取树形选择规范的Menu
function getTreeItem(title: string, key?: React.Key | null, icon?: React.ReactNode, children?: DataNode[]): DataNode {
  return {
    key,
    icon,
    children,
    title,
  } as DataNode;
}

export const getDataNodeTree: (menus: SideMenuItem[], icons: AntdIcon[], onlyParent?: boolean) => DataNode[] = (
  menus,
  icons,
  onlyParent = false
) => {
  // 改写递归，可以套n层
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    return getTreeItem(
      menu.label,
      menu.key,
      icon[0] ? icon[0].icon : undefined,
      menu.children
        ? onlyParent && menu.grade === 2
          ? undefined
          : getDataNodeTree(menu.children, icons, onlyParent)
        : undefined
    );
  });
};

// 设置开关滚动条
// export const setBodyScroll = () => {
//   if (!isNoScroll()) {
//     document.body.style.overflow = 'hidden';
//     // 解决抖动
//     document.body.style.paddingRight = '0.5vw';
//     (document.getElementById('top-header') as HTMLElement).style.paddingRight = '0.5vw';
//   } else {
//     document.body.style.overflow = 'auto';
//     document.body.style.paddingRight = '0';
//     (document.getElementById('top-header') as HTMLElement).style.paddingRight = '0';
//   }
// };
