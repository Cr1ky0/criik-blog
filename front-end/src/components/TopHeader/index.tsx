import React from 'react';
import './index.scss';
import MiddleNav from './MiddleNav';
import RightNav from './RightNav';
import LeftNav from './LeftNav';

const TopHeader = () => {
  return (
    <div className="topHeader">
      <LeftNav />
      <MiddleNav />
      <RightNav />
    </div>
  );
};

export default TopHeader;
