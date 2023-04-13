import React, { useState } from 'react';
import './index.scss';
import TopLink from '../UI/TopLink';
import { chown } from 'fs';

// antd

const TopHeader = () => {
  // TODO:解决点击一个其他的取消选择
  const [isChosen, setIsChosen] = useState([true, false, false, false]);

  // 点击时将其他几个设为false，该按钮对应的设为ture
  const handleClick = (chosenList: boolean[], key: number) => {
    const newList = [];
    for (let i = 0; i < chosenList.length; i += 1) {
      if (i === key) newList.push(!chosenList[key]);
      else newList.push(false);
    }
    setIsChosen(newList);
  };

  return (
    <div className="topHeader">
      <div className="leftNav">leftNav</div>
      <div className="middleNav">
        <TopLink icon="&#xe600;" text={'主页'} seq={0} isChosen={isChosen} handleClick={handleClick} />
        <TopLink icon="&#xe600;" text={'笔记'} seq={1} isChosen={isChosen} handleClick={handleClick} />
        <TopLink icon="&#xe600;" text={'精选'} seq={2} isChosen={isChosen} handleClick={handleClick} />
        <TopLink icon="&#xe600;" text={'其他'} seq={3} isChosen={isChosen} handleClick={handleClick} />
      </div>
      <div className="rightNav">rightNav</div>
    </div>
  );
};

export default TopHeader;
