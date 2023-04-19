import React from 'react';

// hooks
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// css
import style from './index.module.scss';

const LeftNav = () => {
  const { width } = useViewport();
  const breakPoint = 500;
  return width > breakPoint ? (
    <a className={style.leftNav} href="https://github.com/Creekyu" target="_blank" rel="noreferrer">
      <div className={style.leftNavIcon}></div>
      <div className={style.leftNavAuth}>CRIIKY0</div>
    </a>
  ) : (
    <a className={style.leftNav} href="https://github.com/Creekyu" target="_blank" rel="noreferrer">
      <div className={style.leftNavIcon}></div>
    </a>
  );
};

export default LeftNav;
