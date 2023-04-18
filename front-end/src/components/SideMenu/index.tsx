import React from 'react';

// css
import style from './index.module.scss';

// antd
import { Menu } from 'antd';
import type { MenuProps } from 'antd/es/menu';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// interface
import { SideMenuItem } from '@/interface';

export interface SideMenuProps {
  menus: SideMenuItem[];
}

// 将SideMenuItem列表转化为MenuItem列表
const getAntdMenus: (menus: SideMenuItem[]) => MenuItem[] = menus => {
  // 一共三层，最多套三层
  return menus.map(menu => {
    return getItem(
      menu.label,
      menu.key,
      menu.icon,
      menu.children
        ? menu.children.map(menu => {
            return getItem(
              menu.label,
              menu.key,
              menu.icon,
              menu.children
                ? menu.children.map(menu => {
                    return getItem(menu.label, menu.key, menu.icon);
                  })
                : undefined
            );
          })
        : undefined
    );
  });
};
const SideMenu: React.FC<SideMenuProps> = props => {
  const { menus } = props;
  const antdMenus = getAntdMenus(menus);
  return (
    <>
      <Menu
        defaultSelectedKeys={['test1']}
        defaultOpenKeys={['test', 'test4']}
        mode="inline"
        items={antdMenus}
        className={style.menu}
      />
    </>
  );
};

export default SideMenu;
