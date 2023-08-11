import React from 'react';
import { ReactElement } from 'react';

// interface
import {
  AntdIcon,
  BlogObj,
  BreadCrumbObj,
  ClassificationInfoObj,
  MenuItem,
  SideMenuItem,
  TreeSelectItem,
} from '@/interface';

// antd
import type { DataNode } from 'antd/es/tree';

// 过滤掉所有Markdown字符
export const filterMarkdown = (str: string) => {
  // Step 1: 移除HTML标签及其内容
  let result = str.replace(/<[^>]*>.*?<\/[^>]*>/g, '');

  // Step 2: 移除Markdown修饰符
  result = result
    // 移除链接 [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除图片 ![alt](url)
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    // 移除粗体、斜体等
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1')
    // 代码块修饰符去除
    .replace(/(```|~~~)([\s\S]*?)\1/g, '$2')
    // 移除标题标识符
    .replace(/^#+\s+/gm, '')
    // 移除列表标识符
    .replace(/^[-*+]\s+/gm, '')
    // 移除引用块
    .replace(/^>\s+/gm, '');

  return result;
};

// 节流
export const trottle = (fn: any, delay: number) => {
  let valid = true;
  return () => {
    if (valid) {
      valid = false;
      // 立即执行
      fn();
      // 每500ms执行一次
      setTimeout(() => {
        valid = true;
      }, delay);
    }
  };
};

// 颜色相关
export const getColorRgb = (primaryColor: string) => {
  const color = primaryColor.split(',');
  return color.map(item => {
    return Number(item.replace('rgb(', '').replace(')', ''));
  });
};

// Preview
export const onPreview = (url: string) => {
  const src = url as string;
  const image = new Image();
  image.src = src;
  // 居中
  image.style.position = 'absolute';
  image.style.left = '0';
  image.style.right = '0';
  image.style.bottom = '0';
  image.style.top = '0';
  image.style.margin = 'auto';
  const imgWindow = window.open(src);
  imgWindow?.document.write(image.outerHTML);
};

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

// 根据key获得其在SideMenuList对象
export const getSideMenuItem: (menus: SideMenuItem[], key: string) => SideMenuItem | undefined = (menus, key) => {
  const filter = menus.filter(menu => menu.id === key);
  if (filter && filter.length) return filter[0];
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    if (menu.blogs) {
      const filter = (menu.blogs as BlogObj[]).filter(blog => blog.id === key);
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

// 获取第一层展开的key
export const getAllKeyOfSideMenu: (menus: SideMenuItem[]) => string[] = menus => {
  const keys: string[] = [];
  menus.map(menu => {
    keys.push(menu.id);
    // if (menu.children) menu.children.map(child => keys.push(child.id));
  });
  return keys;
};

// 根据blog id获取其parent链
export const getBreadcrumbList: (
  menus: SideMenuItem[],
  id: string,
  icons: AntdIcon[],
  list?: BreadCrumbObj[]
) => BreadCrumbObj[] = (menus, id, icons, list = []) => {
  const blogOrMenu = getSideMenuItem(menus, id) as SideMenuItem;
  if (blogOrMenu) {
    list.unshift({
      title: blogOrMenu.title,
      icon: blogOrMenu.icon ? getAntdIcon(blogOrMenu.icon as string, icons) : undefined,
      color: blogOrMenu.color as string,
      menu_id: blogOrMenu.id,
    });
    if (blogOrMenu.belongingMenu) {
      return getBreadcrumbList(menus, blogOrMenu.belongingMenu, icons, list);
    }
    return list;
  } else return [];
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
        if (blogs.length) {
          blogKey = blogs[0].id;
          return;
        }
      }
      // 进入子菜单
      if (menu.children) {
        menu.children.forEach(child => {
          if (child.id !== menuId)
            if (child.blogs && child.blogs.length) {
              const blogs = child.blogs.filter(blog => blog.id !== curId);
              if (blogs.length) {
                blogKey = blogs[0].id;
                return;
              }
            }
          if (child.children) {
            child.children.forEach(grandChild => {
              if (grandChild.id !== menuId)
                if (grandChild.blogs && grandChild.blogs.length) {
                  const blogs = grandChild.blogs.filter(blog => blog.id !== curId);
                  if (blogs.length) {
                    blogKey = blogs[0].id;
                    return;
                  }
                }
            });
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

// 过滤后端&lt字符
export const filterLT = (text: string) => {
  return text.replaceAll('&lt;', '<');
};

// 过滤blog内容的Title
export const filterTitle = (text: string) => {
  const newContents = filterLT(text);

  // 移除被```或者~~~包围的代码块内容
  const removedCodeblocks = newContents.replace(/(```|~~~)[\s\S]*?\1/g, '');

  // 提取包含1~n个#号的标题内容
  const headings = removedCodeblocks.match(/(^|\n)(#{1,}[^#\n].*)/g);
  // 移除标题前的换行符
  const titleList = headings ? headings.map(line => line.trim()) : [];

  let filterContents = newContents;
  if (titleList) {
    titleList.map((title: string) => {
      const filteredTitle = title.trim().split(/^(#+)/)[2].trim();
      filterContents = filterContents.replace(title, `${title}<span id="${filteredTitle}"></span>`);
    });
  }
  return filterContents;
};

// 获取菜单的Title,Color以及其下的分类和博客数量
const getBlogClassName = (menu: SideMenuItem) => {
  return menu.blogs ? (menu.children ? menu.blogs.length + menu.children.length : menu.blogs.length) : 0;
};
export const getClassificationInfo: (menus: SideMenuItem[]) => ClassificationInfoObj[] = menus => {
  const list = [] as ClassificationInfoObj[];
  menus.map(menu => {
    list.push({
      title: menu.title,
      color: menu.color as string,
      blogNum: getBlogClassName(menu),
      id: menu.id,
    });
    if (menu.children)
      menu.children.map(child => {
        list.push({
          title: child.title,
          color: child.color as string,
          blogNum: getBlogClassName(child),
          id: child.id,
        });
      });
  });
  return list;
};

// 从该菜单获取一个blogId，没有则返回false
export const getOneBlogFromMenu: (menu: SideMenuItem) => string = menu => {
  let id = '';
  if (menu.blogs && menu.blogs.length) id = menu.blogs[0].id;
  else if (menu.children) {
    menu.children.forEach(child => {
      if (child.blogs && child.blogs.length) id = child.blogs[0].id;
    });
  }
  return id;
};

/**************** 列表生成 *****************/

// 将SideMenuItem列表转化为MenuItem列表
function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
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
    const icon = getAntdIcon(menu.icon as string, icons);
    // 可能有blog存在
    const newList: MenuItem[] = [];
    if (menu.blogs && menu.blogs.length) {
      menu.blogs.map(blog => {
        newList.push(getItem(<span className="iconfont">&#xe627;&nbsp;{blog.title}</span>, blog.id));
      });
    }
    return getItem(
      menu.title,
      menu.id,
      icon ? icon : undefined,
      (menu.children && menu.children.length) || (menu.blogs && menu.blogs.length)
        ? ([...newList, ...getAntdMenus(menu.children ? menu.children : [], icons)] as MenuItem[])
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
        ? onlyParent && menu.grade === 3
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
        ? onlyParent && menu.grade === 3
          ? undefined
          : getTreeSelectList(menu.children, icons, onlyParent)
        : undefined
    );
  });
};
