import React from 'react';
import { To } from 'react-router';
import { Link } from 'react-router-dom';
// css
import style from './index.module.scss';

// global
import { THEME_COLOR } from '@/global';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

// handler
import { setChosenList } from '@/redux/slices/chosenList';

interface LinkBtnProps {
  seq: number;
  icon: string;
  children: string;
  link: To;
  notAnimation?: boolean;
}

// 该UI组件用于实现链接按钮效果
const LinkBtn: React.FC<LinkBtnProps> = props => {
  const { seq, icon, children, link, notAnimation } = props;
  // redux
  const { chosenList } = useAppSelector(state => state.chosenList);
  const dispatch = useAppDispatch();

  const contentStyle = { color: THEME_COLOR };
  const handleChosenList = (chosenList: boolean[], key: number) => {
    const newList = [];
    for (let i = 0; i < chosenList.length; i += 1) {
      if (i === key) {
        if (chosenList[key]) newList.push(chosenList[key]); // 当前已被选中则不改变状态
        else newList.push(!chosenList[key]);
      } else newList.push(false);
    }
    // 恢复滚动条
    document.body.style.overflow = 'auto';
    dispatch(setChosenList(newList));
  };
  return (
    <div
      className={`${style.wrapper}`}
      onClick={() => {
        handleChosenList(chosenList, seq);
      }}
    >
      <Link
        className={`${style.content} iconfont`}
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
