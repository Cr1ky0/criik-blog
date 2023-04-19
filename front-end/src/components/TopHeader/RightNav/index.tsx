import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
// css
import style from './index.module.scss';
import './antd.scss';

// comp
import LinkBtn2 from '@/components/UI/LinkBtn2';
import LoginForm from '@/components/TopHeader/RightNav/LoginForm';

// antd
import { message, Modal, Popconfirm } from 'antd';
import { FrownTwoTone } from '@ant-design/icons';

// utils
import { setBodyScroll } from '@/utils';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// gloabl
import { THEME_COLOR } from '@/global';

const RightNav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const avatar = useAvatar();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const navigate = useNavigate();
  const handleLogout = useCallback(async () => {
    await message.success('Successfully Log Out');
    cookies.remove('user');
    cookies.remove('token');
    navigate(0);
  }, []);

  return (
    <div className={style.rightNavPC}>
      {user ? (
        <Popconfirm
          placement="bottom"
          title={'是否要Log Out？'}
          icon={<FrownTwoTone />}
          okText="Yes"
          cancelText="No"
          onConfirm={handleLogout}
        >
          <LinkBtn2 styles={{ marginLeft: '30px', color: THEME_COLOR }}>Log out</LinkBtn2>
        </Popconfirm>
      ) : (
        <>
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
        </>
      )}

      <div className={style.rightNavAvatarPC} style={{ backgroundImage: `url(${avatar})` }}></div>
    </div>
  );
};

export default RightNav;
