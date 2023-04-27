import { ReactElement } from 'react';

// interface
import { AntdIcon, MenuItem, SideMenuItem, TreeSelectItem } from '@/interface';

// antd
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

// 生成SideMenuList对象
export const generateSideMenuItem = (
  id: string,
  title: string,
  grade: number,
  icon?: string,
  belongingMenu?: string
) => {
  return {
    id,
    _id: id,
    belongingMenu,
    title,
    icon,
    grade,
  } as SideMenuItem;
};

// 根据key获得其在SideMenuList对象
export const getSideMenuItem: (menus: SideMenuItem[], key: string) => SideMenuItem | undefined = (menus, key) => {
  let filter = menus.filter(menu => menu.id === key);
  if (filter.length) return filter[0];
  for (let i = 0; i < menus.length; i += 1) {
    if (menus[i].children) {
      filter = (menus[i].children as SideMenuItem[]).filter(child => child.id === key);
      if (filter.length) return filter[0];
    }
  }
};

// 获取所有menu的key（可展开层）
export const getAllKeyOfSideMenu: (menus: SideMenuItem[]) => string[] = menus => {
  const keys: string[] = [];
  menus.map(menu => {
    keys.push(menu.id);
    if (menu.children) menu.children.map(child => keys.push(child.id));
  });
  return keys;
};

// 将SideMenuItem列表转化为MenuItem列表
function getItem(label: string, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// 根据SideMenuItem[]获取规范的Menu组件列表
export const getAntdMenus: (menus: SideMenuItem[], icons: AntdIcon[]) => MenuItem[] = (menus, icons) => {
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    // 可能有blog存在
    const newList: MenuItem[] = [];
    if (menu.blogs.length) {
      menu.blogs.map(blog => {
        newList.push(getItem(blog.title, blog.id));
      });
    }
    return getItem(
      menu.title,
      menu.id,
      icon[0] ? icon[0].icon : undefined,
      menu.children.length ? ([...getAntdMenus(menu.children, icons), ...newList] as MenuItem[]) : undefined
    );
  });
};

// 根据SideMenuItem[]获取树形选择规范的Tree组件列表
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
      menu.title,
      menu.id,
      icon[0] ? icon[0].icon : undefined,
      menu.children
        ? onlyParent && menu.grade === 2
          ? undefined
          : getDataNodeTree(menu.children, icons, onlyParent)
        : undefined
    );
  });
};

// 根据SideMenuItem[]获取树形选择规范的TreeSelect组件列表

function getTreeSelectItem(
  value: React.Key,
  title: string,
  icon?: React.ReactNode,
  children?: TreeSelectItem[]
): TreeSelectItem {
  return {
    value,
    title,
    icon,
    children,
  } as TreeSelectItem;
}

export const getTreeSelectList: (menus: SideMenuItem[], icons: AntdIcon[], onlyParent?: boolean) => TreeSelectItem[] = (
  menus,
  icons,
  onlyParent = false
) => {
  // 改写递归，可以套n层
  return menus.map(menu => {
    // 从iconsContext中提取出对应icon Node
    const icon = icons.filter(icon => icon.name === menu.icon);
    return getTreeSelectItem(
      menu.id,
      menu.title,
      icon[0] ? icon[0].icon : undefined,
      menu.children
        ? onlyParent && menu.grade === 2
          ? undefined
          : getTreeSelectList(menu.children, icons, onlyParent)
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
