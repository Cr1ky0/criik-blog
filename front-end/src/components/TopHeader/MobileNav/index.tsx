import React, { useState } from 'react';

// css
import style from './index.module.scss';

// comp
import MobileMenu from './MoblieMenu';

const MobileNav = () => {
  const [isInit, setIsInit] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.leftNav}></div>
      <div
        className={isOpen ? style.rightNavActive : isInit ? style.rightNavInit : style.rightNavNotActive}
        onClick={() => {
          // 修改根元素滚动
          if (!isOpen) document.body.style.overflow = 'hidden';
          else document.body.style.overflow = 'auto';
          setIsOpen(!isOpen);
          if (isInit) setIsInit(false);
        }}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      {/*<div className={style.test}>*/}
      {/*  <div></div>*/}
      {/*</div>*/}
      <MobileMenu isOpen={isOpen}></MobileMenu>
    </div>
  );
};
export default MobileNav;
