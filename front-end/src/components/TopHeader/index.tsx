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

// redux
import { useAppSelector } from '@/redux';

const TopHeader = () => {
  const { width } = useViewport();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return width > BREAK_POINT ? (
    <div
      id="top-header"
      style={
        themeMode === 'light'
          ? undefined
          : {
              backgroundColor: 'rgba(0, 0, 0, .7)',
            }
      }
    >
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
