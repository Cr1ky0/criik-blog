import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';
import RightNav from '@/components/TopHeader/RightNav';
import LeftNav from '@/components/TopHeader/LeftNav';

const MobileNav = () => {
  const [isInit, setIsInit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <LeftNav></LeftNav>
      <div className={style.rightNavWrapper}>
        <div
          className={isOpen ? style.rightNavActive : isInit ? style.rightNavInit : style.rightNavNotActive}
          onClick={() => {
            const div = document.getElementById('mobile-menu-wrapper') as HTMLElement;
            // 这时还没设置isOpen，故isOpen为true表示要关了
            if (isOpen) div.style.height = '0';
            else
              div.style.height =
                window.innerHeight - (document.getElementById('top-header') as HTMLElement).scrollHeight + 'px';
            setIsOpen(!isOpen);
            if (isInit) setIsInit(false);
          }}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
        <RightNav></RightNav>
      </div>
      <MobileMenu isOpen={isOpen}></MobileMenu>
    </>
  );
};
export default MobileNav;
