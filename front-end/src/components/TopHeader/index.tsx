import React from 'react';

// css
import style from './index.module.scss';

//comp
import MiddleNav from './MiddleNav';
import RightNav from './RightNav';
import LeftNav from './LeftNav';
import MobileNav from './MobileNav';
// hooks
import { useViewport } from '@/components/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';
const TopHeader = () => {
  const { width } = useViewport();

  return width > BREAK_POINT ? (
    <div className={style.topHeader}>
      <LeftNav />
      <MiddleNav />
      <RightNav />
    </div>
  ) : (
    <MobileNav />
  );
};

export default TopHeader;
