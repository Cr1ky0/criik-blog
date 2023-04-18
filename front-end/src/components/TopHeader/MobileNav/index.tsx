import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// css
import style from './index.module.scss';

const MobileNav = () => {
  const [active, setActice] = useState(false);
  const [isInit, setisInit] = useState(true);
  return (
    <div className={style.wrapper}>
      <div className={style.leftNav}></div>

      <div className={active ? style.rightNavActive : style.rightNavNotActive} onClick={() => setActice(!active)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* <div className={style.menu}>
        <div className={style.menuWrapper}>
          <div className="iconfont">&#xe600;</div>
          <div className="iconfont">&#xe60e;</div>
          <div className="iconfont">&#xe896;</div>
          <div className="iconfont">&#xe7df;</div>
        </div>
        <div className={style.introWrapper}></div>
      </div> */}
    </div>
  );
};

export default MobileNav;
