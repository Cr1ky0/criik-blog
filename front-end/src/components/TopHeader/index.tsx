import React from 'react';
import './index.scss';
import TopLink from '../UI/TopLink';

// global
import { themeColor } from '../../global';

// antd

const TopHeader = () => {
  return (
    <div className="topHeader">
      <div className="leftNav">leftNav</div>
      <div className="middleNav">
        <TopLink icon="&#xe600;" themeColor={themeColor} text={'主页'} isChosen={true} />
        <TopLink icon="&#xe600;" themeColor={themeColor} text={'笔记'} />
      </div>
      <div className="rightNav">rightNav</div>
    </div>
  );
};

export default TopHeader;
