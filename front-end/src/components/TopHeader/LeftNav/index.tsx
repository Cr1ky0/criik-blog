import React from 'react';

// css
import style from './index.module.scss';

const LeftNav = () => {
  return (
    <a className={style.leftNav} href="https://github.com/Creekyu" target="_blank" rel="noreferrer">
      <div className={style.leftNavIcon}></div>
      <div className={style.leftNavInfo}>Gezelligheid</div>
    </a>
  );
};

export default LeftNav;
