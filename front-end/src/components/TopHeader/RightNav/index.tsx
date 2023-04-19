import React, { useState } from 'react';

// css
import style from './index.module.scss';
import './antd.scss';

// comp
import LinkBtn2 from '@/components/UI/LinkBtn2';
import LoginForm from '@/components/TopHeader/RightNav/LoginForm';

// img
import img from '@/assets/images/blog-icon.png';

// antd
import { Modal } from 'antd';

// utils
import { setBodyScroll } from '@/utils';

const RightNav = () => {
  const [modalOpen, setModalOpen] = useState(false);
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
      <div className={style.rightNavAvatorPC} style={{ backgroundImage: `url(${img})` }}></div>
    </div>
  );
};

export default RightNav;
