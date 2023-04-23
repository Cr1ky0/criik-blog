import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';
import RightNav from '@/components/TopHeader/RightNav';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

const MobileNav = () => {
  const [isInit, setIsInit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useViewport();
  return (
    <>
      <div className={style.leftNavWrapper}>
        <div
          className={isOpen ? style.leftNavActive : isInit ? style.leftNavInit : style.leftNavNotActive}
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
      </div>
      <MobileMenu isOpen={isOpen}></MobileMenu>
      {width > 300 ? <div className={style.middle}>Gezelligheid</div> : undefined}
      <RightNav></RightNav>
    </>
  );
};
export default MobileNav;
