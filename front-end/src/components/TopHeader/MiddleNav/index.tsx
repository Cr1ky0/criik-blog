import React, { useState } from 'react';

// css
import './index.scss';

// ui-c
import TopLink from '../../UI/LinkBtn';

const MiddleNav = () => {
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
    <div className="middleNav">
      <TopLink icon="&#xe600;" text={'主页'} seq={0} isChosen={isChosen} handleClick={handleClick} link={'/'} />
      <TopLink icon="&#xe60e;" text={'笔记'} seq={1} isChosen={isChosen} handleClick={handleClick} link={'/'} />
      <TopLink icon="&#xe896;" text={'日志'} seq={2} isChosen={isChosen} handleClick={handleClick} link={'/'} />
      <TopLink icon="&#xe7df;" text={'精选'} seq={3} isChosen={isChosen} handleClick={handleClick} link={'/'} />
    </div>
  );
};

export default MiddleNav;
