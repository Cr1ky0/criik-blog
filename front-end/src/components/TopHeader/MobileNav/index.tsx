import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';
import RightNav from '@/components/TopHeader/RightNav';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppSelector } from '@/redux';

const MobileNav = () => {
  const [isInit, setIsInit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const { width } = useViewport();

  const handleClose = () => {
    const div = document.getElementById('mobile-menu-wrapper') as HTMLElement;
    // 这时还没设置isOpen，故isOpen为true表示要关了
    div.style.height = '0';
    setIsOpen(false);
  };

  const handleOpen = () => {
    const div = document.getElementById('mobile-menu-wrapper') as HTMLElement;
    div.style.height = window.innerHeight - (document.getElementById('top-header') as HTMLElement).scrollHeight + 'px';
    setIsOpen(true);
  };

  return (
    <>
      <div className={style.leftNavWrapper}>
        <div
          className={isOpen ? style.leftNavActive : isInit ? style.leftNavInit : style.leftNavNotActive}
          onClick={() => {
            if (isOpen) handleClose();
            else handleOpen();
            if (isInit) setIsInit(false);
          }}
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <MobileMenu isOpen={isOpen} close={handleClose}></MobileMenu>
      {width > 300 ? (
        <div className={`${style.middle} ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}>Gezelligheid</div>
      ) : undefined}
      <RightNav></RightNav>
    </>
  );
};
export default MobileNav;
