import React, { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';

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
import { setMenuList, setSelectedId } from '@/redux/slices/blog';
import { setCurBlog } from '@/redux/slices/blog';

// context
import { useIcons } from '../ContextProvider/IconStore';

// utils
import { getAntdMenus, getAllKeyOfSideMenu, getSideMenuItem } from '@/utils';

// interface
import { SideMenuItem } from '@/interface';

interface SideMenuProps {
  styles?: CSSProperties;
  noEdit?: boolean;
  setLoading?: (state: boolean) => void; // 加载blog时的动画
}

const SideMenu: React.FC<SideMenuProps> = ({ styles, noEdit, setLoading }) => {
  const icons = useIcons();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const menus = useAppSelector(state => state.blog.menuList);
  const antdMenus = getAntdMenus(menus, icons);
  // 当前选中的左边菜单栏目
  const selectedId = useAppSelector(state => state.blog.selectedId);
  // 预览展开state
  const [open, setOpen] = useState(false);
  // timer
  const [timer, setTimer] = useState<any>();
  useEffect(() => {
    const cookies = new Cookies();
    const user = cookies.get('user');
    if (user) dispatch(setMenuList());
  }, []);
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
          // TODO:解决刷新展开问题
          defaultOpenKeys={getAllKeyOfSideMenu(menus)}
          expandIcon={<DownOutlined />}
          mode="inline"
          items={antdMenus}
          selectedKeys={[selectedId]}
          // handle select
          onClick={async e => {
            const item = getSideMenuItem(menus, e.key) as SideMenuItem;
            if (!item.grade) {
              dispatch(setSelectedId(e.key));
              if (setLoading) {
                setLoading(true);
                // 清除上一次timer，不然重复点动画加载有问题
                clearTimeout(timer);
                setTimer(
                  setTimeout(() => {
                    setLoading(false);
                  }, 1000)
                );
              }
              // 更改当前选中对象
              dispatch(setCurBlog(e.key));
              // 更改nav
              navigate('/blog');
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
