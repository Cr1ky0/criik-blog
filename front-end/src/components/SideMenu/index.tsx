import React, { useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Menu, Modal } from 'antd';

// ui
import LinkBtn2 from '@/components/UI/LinkBtn2';

// redux
import { useAppSelector } from '@/redux';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus } from '@/utils';
import EditMenu from '@/components/SideMenu/EditMenu';

const SideMenu = () => {
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const [open, setOpen] = useState(false);
  const icons = useIcons();
  const antdMenus = getAntdMenus(menus, icons);
  return (
    <div className={style.wrapper}>
      <div className={style.edit}>
        <LinkBtn2
          className={`${style.editBtn} iconfont`}
          onClick={() => {
            setOpen(true);
          }}
        >
          &#xe603;
        </LinkBtn2>
      </div>
      <div>
        <Modal
          title="编辑分类标签"
          centered
          footer=""
          destroyOnClose
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
        >
          <EditMenu></EditMenu>
        </Modal>
      </div>
      {menus.length ? (
        <Menu
          style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
          defaultSelectedKeys={['test1']}
          defaultOpenKeys={['test', 'test4']}
          mode="inline"
          items={antdMenus}
        />
      ) : (
        <div className={style.noneMenu}>当前还没有分类，快去添加吧！</div>
      )}
    </div>
  );
};

export default SideMenu;
