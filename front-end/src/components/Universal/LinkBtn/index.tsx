import React from 'react';
import { To } from 'react-router';
import { Link } from 'react-router-dom';

// css
import style from './index.module.scss';

// global
import { THEME_COLOR } from '@/global';

// redux
import { useAppSelector } from '@/redux';

interface LinkBtnProps {
  seq: number;
  icon: string;
  children: string;
  link: To;
  notAnimation?: boolean;
  onClick?: () => void;
}

// 该UI组件用于实现链接按钮效果
const LinkBtn: React.FC<LinkBtnProps> = props => {
  const { seq, icon, children, link, notAnimation, onClick } = props;
  // redux
  const { chosenList } = useAppSelector(state => state.chosenList);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  const contentStyle = { color: THEME_COLOR };
  return (
    <div className={`${style.wrapper}`} onClick={onClick}>
      <Link
        className={`${style.content} iconfont ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}
        style={chosenList[seq] ? contentStyle : { color: '#666666' }}
        to={link}
      >
        <div>
          {icon}&nbsp;
          {children}
        </div>
        {notAnimation ? undefined : <div className={chosenList[seq] ? style.chosenBar : style.bar}></div>}
      </Link>
    </div>
  );
};

export default LinkBtn;
