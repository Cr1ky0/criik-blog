import React, { CSSProperties, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Menu, Modal } from 'antd';

// css
import style from './index.module.scss';

// ui
import LinkBtn2 from '@/components/Universal/LinkBtn2';
import EditMenu from '@/components/SideMenu/EditMenu';

// redux
import { useAppSelector, useAppDispatch } from '@/redux';
import { setSelectedId, setOpt } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getSideMenuItem, getParentListOfBlog } from '@/utils';

// interface
import { SideMenuItem } from '@/interface';

// global
import { ANIME_HIDE_TIME } from '@/global';

interface SideMenuProps {
  styles?: CSSProperties;
  noEdit?: boolean;
  page: 'manage' | 'blog';
  closeMenu?: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ styles, noEdit, page, closeMenu }) => {
  const icons = useIcons();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const opt = useAppSelector(state => state.blogMenu.opt);
  const antdMenus = getAntdMenus(menus, icons);
  const [parentKey] = useState(getParentListOfBlog(menus, icons, selectedId));
  // 预览展开state
  const [open, setOpen] = useState(false);

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
          inlineIndent={12}
          style={{ borderRadius: '0 0 5px 5px', border: 'none' }}
          defaultOpenKeys={parentKey}
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
                  dispatch(setOpt(false));
                  dispatch(setJumpFlag(true));
                  setTimeout(async () => {
                    await dispatch(setSelectedId(e.key));
                    if (page === 'blog') {
                      navigate(`/blog`);
                    }
                  }, ANIME_HIDE_TIME);
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
