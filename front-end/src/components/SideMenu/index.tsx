import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Menu, Modal } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';

// ui
import LinkBtn2 from '@/components/Universal/LinkBtn2';
import EditMenu from '@/components/SideMenu/EditMenu';

// redux
import { useAppSelector, useAppDispatch } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getAllKeyOfSideMenu, getSideMenuItem } from '@/utils';

// interface
import { SideMenuItem } from '@/interface';

interface SideMenuProps {
  styles?: CSSProperties;
  noEdit?: boolean;
  page: 'manage' | 'blog';
  closeMenu?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ styles, noEdit, page, closeMenu }) => {
  // TODO:Menu宽度调整
  const icons = useIcons();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const antdMenus = getAntdMenus(menus, icons);
  // 当前选中的左边菜单栏目
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  // 预览展开state
  const [open, setOpen] = useState(false);

  // 可操作标志
  const [opt, setOpt] = useState(true);

  return (
    <div className={style.wrapper} style={styles}>
      {noEdit ? undefined : (
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
      )}
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
          className={style.menu}
          style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
          defaultOpenKeys={getAllKeyOfSideMenu(menus)}
          expandIcon={<DownOutlined />}
          mode="inline"
          items={antdMenus}
          selectedKeys={[selectedId]}
          // handle select
          onClick={e => {
            if (opt) {
              if (!noEdit) {
                dispatch(setSelectedId(e.key));
              } else {
                // 触发事件
                const item = getSideMenuItem(menus, e.key) as SideMenuItem;
                if (!item.grade && e.key !== selectedId) {
                  // 操作标志置为false，不可继续操作
                  setOpt(false);
                  dispatch(setJumpFlag(true));
                  setTimeout(() => {
                    dispatch(setSelectedId(e.key));
                    // 重置可操作标志
                    setOpt(true);
                    if (page === 'blog') {
                      navigate(`/blog`);
                    }
                  }, 1050);
                }
                if (closeMenu) closeMenu();
              }
            }
          }}
        />
      ) : (
        <div className={style.noneMenu}>当前还没有分类，快去添加吧！</div>
      )}
    </div>
  );
};

export default SideMenu;
