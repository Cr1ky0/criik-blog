import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
// css
import style from './index.module.scss';

// comp
import LinkBtn2 from '@/components/UI/LinkBtn2';
import LoginForm from '@/components/TopHeader/LoginForm';
import Information from '@/components/TopHeader/Information';
import ChangeInfo from '@/components/TopHeader/ChangeInfo';

// antd
import { Modal, Popconfirm, Dropdown, Drawer } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';
import type { MenuProps } from 'antd';

// utils
import { setBodyScroll } from '@/utils';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// gloabl
import { BREAK_POINT } from '@/global';

const RightNav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [openInfomation, setOpenInfomation] = useState(false);
  const [openChangeInfo, setOpenChangeInfo] = useState(false);
  const message = useGlobalMessage();
  const avatar = useAvatar();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const navigate = useNavigate();
  const { width } = useViewport();
  // handle log out
  const handleLogout = useCallback(async () => {
    // await可以让按钮进入加载状态
    await message.success('Successfully Log Out');
    cookies.remove('user');
    cookies.remove('token');
    navigate(0);
  }, []);
  const onCloseInfo = useCallback(() => {
    setOpenInfomation(false);
    setBodyScroll();
  }, []);
  const onCloseChangeInfo = useCallback(() => {
    setOpenChangeInfo(false);
    setBodyScroll();
  }, []);

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            setOpenInfomation(!openInfomation);
            setBodyScroll();
          }}
        >
          个人信息
        </div>
      ),
      key: '0',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            setOpenChangeInfo(!openInfomation);
            setBodyScroll();
          }}
        >
          修改信息
        </div>
      ),
      key: '1',
    },
  ];

  return (
    <div className={style.rightNav}>
      {message.holder}
      {/* 是否登录判断 */}
      {user ? (
        <>
          <Popconfirm
            placement="bottom"
            title={'是否要Log Out？'}
            icon={<FrownTwoTone />}
            okText="Yes"
            cancelText="No"
            onConfirm={handleLogout}
          >
            <LinkBtn2 className={style.logOut} styles={width < BREAK_POINT ? { marginLeft: '80px' } : undefined}>
              Log out
            </LinkBtn2>
          </Popconfirm>
        </>
      ) : (
        <div className={style.signWrapper}>
          <LinkBtn2>Sing up</LinkBtn2>
          <LinkBtn2
            onClick={() => {
              setModalOpen(true);
              setBodyScroll();
            }}
          >
            Sign in
          </LinkBtn2>
          <Modal
            centered
            destroyOnClose
            maskClosable={false}
            open={modalOpen}
            onCancel={() => {
              setModalOpen(false);
              setBodyScroll();
            }}
          >
            <LoginForm
              close={() => {
                setModalOpen(false);
              }}
            ></LoginForm>
          </Modal>
        </div>
      )}
      {/*  菜单栏选项 */}
      {width < BREAK_POINT ? undefined : user ? (
        <>
          <Dropdown menu={{ items }} trigger={['click']}>
            <div className={style.rightNavAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
          </Dropdown>
          <Drawer
            title="Personal Information"
            style={{ border: 'none' }}
            width={400}
            placement="right"
            closable={false}
            onClose={onCloseInfo}
            open={openInfomation}
            destroyOnClose
          >
            <Information></Information>
          </Drawer>

          <Drawer
            title="Personal Information"
            style={{ border: 'none' }}
            width={400}
            placement="right"
            closable={false}
            onClose={onCloseChangeInfo}
            open={openChangeInfo}
            destroyOnClose
          >
            <ChangeInfo></ChangeInfo>
          </Drawer>
        </>
      ) : (
        <div
          className={style.rightNavAvatar}
          style={{ backgroundImage: `url(${avatar})` }}
          onClick={() => {
            message.error('请先登录！');
          }}
        ></div>
      )}
    </div>
  );
};

export default RightNav;
