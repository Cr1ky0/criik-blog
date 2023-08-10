import React from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

const LeftNav = () => {
  const themeMode = useAppSelector(state => state.universal.themeMode);

  return (
    <a className={style.leftNav} href="https://www.criiky0.top" target="_blank" rel="noreferrer">
      <div className={style.leftNavIcon}></div>
      <div className={`${style.leftNavInfo} ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}>Gezelligheid</div>
    </a>
  );
};

export default LeftNav;
