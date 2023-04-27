import React, { CSSProperties, useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Menu, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// ui
import LinkBtn2 from '@/components/UI/LinkBtn2';
import EditMenu from '@/components/SideMenu/EditMenu';

// redux
import { useAppSelector, useAppDispatch } from '@/redux';
import { setMenuList, setSelectedId } from '@/redux/slices/blogMenu';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getAllKeyOfSideMenu, getSideMenuItem } from '@/utils';
import { SideMenuItem } from '@/interface';

interface SideMenuProps {
  styles?: CSSProperties;
}

const SideMenu: React.FC<SideMenuProps> = ({ styles }) => {
  const icons = useIcons();
  const dispatch = useAppDispatch();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const antdMenus = getAntdMenus(menus, icons);
  // 当前选中的左边菜单栏目
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  // 预览展开state
  const [open, setOpen] = useState(false);
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
      {/* 有tag则显示菜单，否则显示提示 */}
      {menus.length ? (
        <Menu
          style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
          openKeys={getAllKeyOfSideMenu(menus)}
          expandIcon={<DownOutlined />}
          mode="inline"
          items={antdMenus}
          selectedKeys={[selectedId]}
          onSelect={e => {
            const item = getSideMenuItem(menus, e.key) as SideMenuItem;
            if (!item.grade) dispatch(setSelectedId(e.key));
          }}
        />
      ) : (
        <div className={style.noneMenu}>当前还没有分类，快去添加吧！</div>
      )}
    </div>
  );
};

export default SideMenu;
