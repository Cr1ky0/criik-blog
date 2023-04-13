import React, { useState, useEffect } from 'react';
import style from './index.module.scss';

// global
import { themeColor } from '../../../global';

interface TopLinkProps {
  seq: number;
  icon: string;
  text: string;
  isChosen: boolean[];
  handleClick: (chosenList: boolean[], key: number) => void;
}

// 该UI组件用于实现链接按钮效果
const TopLink: React.FC<TopLinkProps> = props => {
  const { seq, icon, text, isChosen, handleClick } = props;
  const contentStyle = { color: themeColor };
  const barStyle = { backgroundColor: themeColor };

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        handleClick(isChosen, seq);
      }}
    >
      <div className={`iconfont ${style.content}`} style={isChosen[seq] ? contentStyle : { color: '#666666' }}>
        {icon}&nbsp;
        {text}
      </div>
      <div className={isChosen[seq] ? style.chosenBar : style.bar} style={barStyle}></div>
    </div>
  );
};

export default TopLink;
