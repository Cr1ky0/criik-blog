import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';
import RightNav from '@/components/TopHeader/RightNav';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import ElasticSearch from '@/components/ElasticSearch';
import { setThemeMode } from '@/redux/slices/universal';

const MobileNav = () => {
  const [isInit, setIsInit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
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

        <div className={style.es}>
          <ElasticSearch></ElasticSearch>
        </div>
        {/* 黑暗模式 */}
        <div
          className={`${style.themeMode} iconfont  ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}
          onClick={() => {
            dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'));
          }}
        >
          {themeMode === 'light' ? <span>&#xe655;</span> : <span>&#xe62c;</span>}
        </div>
      </div>
      <MobileMenu isOpen={isOpen} close={handleClose}></MobileMenu>
      <RightNav></RightNav>
    </>
  );
};
export default MobileNav;
