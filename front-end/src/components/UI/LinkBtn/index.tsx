import React from 'react';
import { To } from 'react-router';
import { Link } from 'react-router-dom';
// css
import style from './index.module.scss';

// global
import { THEME_COLOR } from '../../../global';

interface LinkBtnProps {
  seq: number;
  icon: string;
  text: string;
  isChosen: boolean[];
  link: To;
  handleClick: (chosenList: boolean[], key: number) => void;
}

// 该UI组件用于实现链接按钮效果
const LinkBtn: React.FC<LinkBtnProps> = props => {
  const { seq, icon, text, isChosen, link, handleClick } = props;

  const contentStyle = { color: THEME_COLOR };
  const barStyle = { backgroundColor: THEME_COLOR };

  return (
    <div
      className={style.wrapper}
      onClick={() => {
        handleClick(isChosen, seq);
      }}
    >
      <Link
        className={`iconfont ${style.content}`}
        style={isChosen[seq] ? contentStyle : { color: '#666666' }}
        to={link}
      >
        {icon}&nbsp;
        {text}
      </Link>
      <div className={isChosen[seq] ? style.chosenBar : style.bar} style={barStyle}></div>
    </div>
  );
};

export default LinkBtn;
