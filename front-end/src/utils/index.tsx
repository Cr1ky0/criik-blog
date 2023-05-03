import { ReactElement } from 'react';

// interface
import {
  AntdIcon,
  blogObj,
  BreadCrumbObj,
  ClassificationInfoObj,
  MenuItem,
  SideMenuItem,
  TreeSelectItem,
} from '@/interface';

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
  grade?: number,
  icon?: string,
  color?: string,
  belongingMenu?: string
) => {
  return {
    id,
    _id: id,
    belongingMenu,
    title,
    icon,
    color,
    grade,
  } as SideMenuItem;
};

// 根据key获得其在SideMenuList对象
export const getSideMenuItem: (menus: SideMenuItem[], key: string) => SideMenuItem | undefined = (menus, key) => {
  const filter = menus.filter(menu => menu.id === key);
  if (filter && filter.length) return filter[0];
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    if (menu.blogs) {
      const filter = (menu.blogs as blogObj[]).filter(blog => blog.id === key);
      if (filter && filter.length) return filter[0];
    }
    if (menu.children) {
      // 这里递归不能直接返回，因为在循环内存在多个递归，如果直接返回会导致被undefined覆盖
      // 因此需要指定值当值存在时再返回
      const temp = getSideMenuItem(menu.children as SideMenuItem[], key);
      if (temp) return temp;
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

// 根据blog id获取其parent链
export const getBreadcrumbList: (menus: SideMenuItem[], id: string, icons: AntdIcon[]) => BreadCrumbObj[] = (
  menus,
  id,
  icons
) => {
  const list = [] as BreadCrumbObj[];
  const blog = getSideMenuItem(menus, id) as SideMenuItem;
  list.unshift({ title: blog.title, icon: undefined });
  if (blog.belongingMenu) {
    const parent = getSideMenuItem(menus, blog.belongingMenu) as SideMenuItem;
    list.unshift({ title: parent.title, icon: getAntdIcon(parent.icon as string, icons) });
    if (parent.belongingMenu) {
      const grandParent = getSideMenuItem(menus, parent.belongingMenu) as SideMenuItem;
      list.unshift({ title: grandParent.title, icon: getAntdIcon(grandParent.icon as string, icons) });
    }
  }
  return list;
};

// 从SideMenuList内获取一个blog key
export const getOneBlogId: (menus: SideMenuItem[], curId?: string, menuId?: string) => string | void = (
  menus,
  curId,
  menuId
) => {
  // curId用来避免选中当前已选中的id
  // menuId用来避免选中当前菜单下的SelectedId
  // 这两个参数都可选
  let blogKey = '';
  menus.forEach(menu => {
    if (menu.id !== menuId) {
      // 检查blogs
      if (menu.blogs && menu.blogs.length) {
        const blogs = menu.blogs.filter(blog => blog.id !== curId);
        if (blogs.length) blogKey = blogs[0].id;
      }
      // 进入子菜单
      if (menu.children) {
        menu.children.forEach(child => {
          if (child.id !== menuId)
            if (child.blogs && child.blogs.length) {
              const blogs = child.blogs.filter(blog => blog.id !== curId);
              if (blogs.length) blogKey = blogs[0].id;
            }
        });
      }
    }
  });
  return blogKey;
};

// 检测当前SideMenuItem其是否包含blog
export const hasBlog: (menus: SideMenuItem[]) => boolean = menus => {
  let flag = false;
  menus.map(menu => {
    if (menu.blogs && menu.blogs.length) flag = true;
    if (menu.children)
      menu.children.map(child => {
        if (child.blogs && child.blogs.length) flag = true;
      });
  });
  return flag;
};

// 检测当前删除的菜单是否包含curKey
export const hasCurKey: (menu: SideMenuItem, curKey: string | number) => boolean = (menu, curKey) => {
  let flag = false;
  if (menu.id === curKey) {
    flag = true;
  }
  if (menu.children)
    menu.children.map(child => {
      if (child.id === curKey) flag = true;
    });
  return flag;
};

// 获取一个菜单Item的Id
export const getOneMenuId: (menus: SideMenuItem[]) => string = menus => {
  if (menus.length) return menus[0].id;
  else {
    return '';
  }
};

// 通过likeList判断该评论是否已被点赞
export const isLike = (likeList: string[], id: string) => {
  return likeList.some(itemId => itemId === id);
};

// 过滤blog内容的Title
export const filterTitle = (text: string) => {
  const newContents = text.replaceAll('&lt;', '<');
  const titleList = newContents.match(/#(.*)/g);
  let filterContents = newContents;
  if (titleList)
    titleList.map((title: string) => {
      const filteredTitle = title.split('#')[1].trim();
      filterContents = filterContents.replace(title, `${title}<span id="${filteredTitle}"></span>`);
    });
  return filterContents;
};

// 获取所有menu的Title,Color以及其下的博客数量
export const getClassificationInfo: (menus: SideMenuItem[]) => ClassificationInfoObj[] = menus => {
  const list = [] as ClassificationInfoObj[];
  menus.map(menu => {
    list.push({
      title: menu.title,
      color: menu.color as string,
      blogNum: menu.blogs ? menu.blogs.length : 0,
      id: menu.id,
    });
    if (menu.children)
      menu.children.map(child => {
        list.push({
          title: child.title,
          color: child.color as string,
          blogNum: child.blogs ? child.blogs.length : 0,
          id: child.id,
        });
      });
  });
  return list;
};

/**************** 列表生成 *****************/

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
    // const icon = icons.filter(icon => icon.name === menu.icon);
    const icon = getAntdIcon(menu.icon as string, icons);
    // 可能有blog存在
    const newList: MenuItem[] = [];
    if (menu.blogs && menu.blogs.length) {
      menu.blogs.map(blog => {
        newList.push(getItem(blog.title, blog.id));
      });
    }
    return getItem(
      menu.title,
      menu.id,
      icon ? icon : undefined,
      (menu.children && menu.children.length) || (menu.blogs && menu.blogs.length)
        ? ([...getAntdMenus(menu.children ? menu.children : [], icons), ...newList] as MenuItem[])
        : undefined
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
