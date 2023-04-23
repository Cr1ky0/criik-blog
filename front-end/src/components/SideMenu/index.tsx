import React from 'react';

// css
import style from './index.module.scss';

// antd
import { Menu } from 'antd';

// ui
import LinkBtn2 from '@/components/UI/LinkBtn2';

// redux
import { useAppSelector } from '@/redux';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus } from '@/utils';

const SideMenu = () => {
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const icons = useIcons();
  const antdMenus = getAntdMenus(menus, icons);
  return (
    <div className={style.wrapper}>
      <div className={style.edit}>
        <LinkBtn2 className={`${style.editBtn} iconfont`}>&#xe603;</LinkBtn2>
        <LinkBtn2 className={`${style.deleteBtn} iconfont`}>&#xe604;</LinkBtn2>
      </div>
      <Menu
        style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
        defaultSelectedKeys={['test1']}
        defaultOpenKeys={['test', 'test4']}
        mode="inline"
        items={antdMenus}
      />
    </div>
  );
};

export default SideMenu;
