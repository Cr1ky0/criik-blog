import React, { useContext, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
// css
import style from './index.module.scss';
import './antd.scss';

// comp
import LinkBtn2 from '@/components/UI/LinkBtn2';
import LoginForm from '@/components/TopHeader/RightNav/LoginForm';

// img
import img from '@/assets/images/default.png';

// antd
import { Modal } from 'antd';

// utils
import { setBodyScroll } from '@/utils';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

const RightNav = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const avatar = useAvatar();

  return (
    <div className={style.rightNavPC}>
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
      <div className={style.rightNavAvatarPC} style={{ backgroundImage: `url(${avatar})` }}></div>
    </div>
  );
};

export default RightNav;
