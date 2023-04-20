import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';
import RightNav from '@/components/TopHeader/RightNav';
import LeftNav from '@/components/TopHeader/LeftNav';
import { setBodyScroll } from '@/utils';

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
            setBodyScroll();
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
