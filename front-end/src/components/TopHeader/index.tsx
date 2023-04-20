import React from 'react';

// css
import './index.scss';

//comp
import MiddleNav from './MiddleNav';
import RightNav from './RightNav';
import LeftNav from './LeftNav';
import MobileNav from './MobileNav';
// hooks
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';

const TopHeader = () => {
  const { width } = useViewport();
  return width > BREAK_POINT ? (
    <div id="top-header">
      <LeftNav />
      <MiddleNav />
      <RightNav />
    </div>
  ) : (
    <div id="top-header">
      <MobileNav />
    </div>
  );
};

export default TopHeader;
