import React from 'react';
import style from './index.module.scss';

interface TopLinkProps {
  icon: string;
  themeColor: string;
  text: string;
  isChosen?: boolean;
}

// 该UI组件用于实现链接按钮效果
const TopLink: React.FC<TopLinkProps> = props => {
  const { icon, themeColor, text } = props;
  let isChosen = false;
  if (props.isChosen) isChosen = props.isChosen;

  const contentStyle = { color: themeColor, fontSize: '12px' };
  const barStyle = { backgroundColor: themeColor };
  return (
    <div className={style.wrapper}>
      <div className={`iconfont ${style.content}`} style={contentStyle}>
        {icon}&nbsp;
        {text}
      </div>
      <div className={style.bar} style={barStyle}></div>
    </div>
  );
};

export default TopLink;
