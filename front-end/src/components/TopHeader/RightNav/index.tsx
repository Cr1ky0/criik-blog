import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
// css
import style from './index.module.scss';

// comp
import LinkBtn2 from '@/components/UI/LinkBtn2';
import LoginForm from '@/components/TopHeader/LoginForm';
import Avatar from '@/components/TopHeader/Avatar';

// antd
import { Modal, Popconfirm } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// gloabl
import { BREAK_POINT } from '@/global';

const RightNav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const message = useGlobalMessage();
  const { width } = useViewport();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const user = cookies.get('user');
  // handle log out
  const handleLogout = useCallback(async () => {
    // await可以让按钮进入加载状态
    await message.loadingSuccessAsync('登出中...', '成功退出登录！');
    cookies.remove('user');
    cookies.remove('token');
    navigate(0);
  }, []);

  return (
    <div className={style.rightNav}>
      {/* 是否登录判断 */}
      {user ? (
        <>
          {/* 登录了显示logout */}
          <Popconfirm
            placement="bottom"
            title={'是否要Log Out？'}
            icon={<FrownTwoTone />}
            okText="Yes"
            cancelText="No"
            onConfirm={handleLogout}
          >
            <LinkBtn2 className={style.logOut}>Log out</LinkBtn2>
          </Popconfirm>
        </>
      ) : (
        //   没登录显示登录
        <div className={style.signWrapper}>
          <LinkBtn2>Sing up</LinkBtn2>
          <LinkBtn2
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Sign in
          </LinkBtn2>
          {/* Login界面 */}
          <Modal
            centered
            destroyOnClose
            maskClosable={false}
            width={width > BREAK_POINT ? '320px' : '60vw'}
            footer=""
            open={modalOpen}
            onCancel={() => {
              setModalOpen(false);
            }}
          >
            <LoginForm
              close={() => {
                setModalOpen(false);
                // setBodyScroll();
              }}
            ></LoginForm>
          </Modal>
        </div>
      )}
      {/*  菜单栏选项 */}
      <Avatar></Avatar>
    </div>
  );
};

export default RightNav;
