import React from 'react';
import './index.scss';
import MiddleNav from './MiddleNav';
import RightNav from './RightNav';

const TopHeader = () => {
  return (
    <div className="topHeader">
      <div className="leftNav">leftNav</div>
      <MiddleNav />
      <RightNav />
    </div>
  );
};

export default TopHeader;
