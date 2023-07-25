import React, { forwardRef, useMemo } from 'react';

// css
import style from './index.module.scss';

// global
import { THEME_COLOR, BREAK_POINT } from '@/global';

// provider
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

interface BackToTopBtnProps {
  scrollTop: number;
  scrollHeight: number;
  onClick: () => void;
}

const BackToTopBtn = forwardRef<HTMLDivElement, BackToTopBtnProps>((props, ref) => {
  const { scrollTop, scrollHeight, onClick } = props;
  const { width } = useViewport();
  const radius = useMemo(() => {
    return width > BREAK_POINT ? 30 : 22.5;
  }, [width]);
  const perimeter = useMemo(() => {
    return radius * 2 * Math.PI;
  }, [width]);
  const strokeWidth = useMemo(() => {
    return width > BREAK_POINT ? 3 : 1.5;
  }, [width]);
  return (
    <div className={style.wrapper} onClick={onClick} ref={ref}>
      <svg width={radius * 2} height={radius * 2}>
        <circle
          className={style.circle}
          cx={radius}
          cy={radius}
          r={radius - 1}
          strokeWidth={strokeWidth}
          stroke={THEME_COLOR}
          // 当前圆环进度多少=滚动大小/总滚动高度 * 周长，代表滚动了多少
          // 注意，右边参数表示两个dash之间的分隔距离，写为周长可以让其重叠
          strokeDasharray={`${(scrollTop / scrollHeight) * perimeter} ${perimeter}`}
        />
      </svg>
      <div className={`${style.icon} iconfont`}>&#xe7d9;</div>
    </div>
  );
});

BackToTopBtn.displayName = 'BackToTopBtn';
export default BackToTopBtn;
