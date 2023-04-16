import React, { useState } from 'react';

// css
import './index.scss';

// ui-c
import LinkBtn from '@/components/UI/LinkBtn';

const MiddleNav = () => {
  const [isChosen, setIsChosen] = useState([true, false, false, false]);

  // 点击时将其他几个设为false，该按钮对应的设为ture
  const handleClick = (chosenList: boolean[], key: number) => {
    const newList = [];
    for (let i = 0; i < chosenList.length; i += 1) {
      if (i === key) {
        if (chosenList[key]) newList.push(chosenList[key]); // 当前已被选中则不改变状态
        else newList.push(!chosenList[key]);
      } else newList.push(false);
    }
    setIsChosen(newList);
  };

  return (
    <div className="middle-nav">
      <LinkBtn icon="&#xe600;" seq={0} isChosen={isChosen} handleClick={handleClick} link={'/'}>
        主页
      </LinkBtn>
      <LinkBtn icon="&#xe60e;" seq={1} isChosen={isChosen} handleClick={handleClick} link={'/test'}>
        笔记
      </LinkBtn>
      <LinkBtn icon="&#xe896;" seq={2} isChosen={isChosen} handleClick={handleClick} link={'/'}>
        写博客
      </LinkBtn>
      <LinkBtn icon="&#xe7df;" seq={3} isChosen={isChosen} handleClick={handleClick} link={'/'}>
        精选
      </LinkBtn>
    </div>
  );
};

export default MiddleNav;
