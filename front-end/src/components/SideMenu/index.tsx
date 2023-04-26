import React, { CSSProperties, useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Menu, Modal } from 'antd';

// ui
import LinkBtn2 from '@/components/UI/LinkBtn2';
import EditMenu from '@/components/SideMenu/EditMenu';

// redux
import { useAppSelector, useAppDispatch } from '@/redux';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getAllKeyOfSideMenu } from '@/utils';
import { setMenuList } from '@/redux/slices/blogMenu';

interface SideMenuProps {
  styles?: CSSProperties;
}

const SideMenu: React.FC<SideMenuProps> = ({ styles }) => {
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const icons = useIcons();
  const antdMenus = getAntdMenus(menus, icons);
  useEffect(() => {
    dispatch(setMenuList());
  }, []);
  return (
    <div className={style.wrapper} style={styles}>
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
          openKeys={getAllKeyOfSideMenu(menus)}
          defaultSelectedKeys={['test1']}
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
