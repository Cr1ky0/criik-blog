import React, { forwardRef } from 'react';

// antd
import { Popover } from 'antd';

// css
import style from './index.module.scss';

// global
import { THEME_COLOR } from '@/global';

interface BackToTopBtnProps {
  scrollTop: number;
  scrollHeight: number;
  onClick: () => void;
}

const BackToTopBtn = forwardRef<HTMLDivElement, BackToTopBtnProps>((props, ref) => {
  const { scrollTop, scrollHeight, onClick } = props;
  return (
    <Popover placement="left" content="回到顶部">
      <div className={style.wrapper} onClick={onClick} ref={ref}>
        <svg width="60" height="60">
          <circle
            className={style.circle}
            cx="30"
            cy="30"
            r="29"
            fill="#FFF"
            strokeWidth="3"
            stroke={THEME_COLOR}
            // 当前圆环进度多少=滚动大小/总滚动高度 * 周长，代表滚动了多少
            // 注意，右边参数表示两个dash之间的分隔距离，写为周长可以让其重叠
            // 这里周长=29*2*3.14
            strokeDasharray={`${(scrollTop / scrollHeight) * 182.12} 182.12`}
          />
        </svg>
        <div className={`${style.icon} iconfont`}>&#xe7d9;</div>
      </div>
    </Popover>
  );
});

BackToTopBtn.displayName = 'BackToTopBtn';
export default BackToTopBtn;
