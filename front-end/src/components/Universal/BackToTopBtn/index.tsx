import React, { useState, useEffect, useMemo, useRef } from 'react';

// css
import style from './index.module.scss';

// global
import { THEME_COLOR, BREAK_POINT } from '@/global';

// provider
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppSelector } from '@/redux';

const BackToTopBtn = () => {
  const { width } = useViewport();
  const [scrollTop, setScrollTop] = useState(document.documentElement.scrollTop);
  const [scrollHeight, setScrollHeight] = useState(document.documentElement.scrollHeight - window.innerHeight);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const thisRef = useRef<HTMLDivElement>(null);
  const radius = useMemo(() => {
    return width > BREAK_POINT ? 30 : 22.5;
  }, [width]);
  const perimeter = useMemo(() => {
    return radius * 2 * Math.PI;
  }, [width]);
  const strokeWidth = useMemo(() => {
    return width > BREAK_POINT ? 3 : 1.5;
  }, [width]);

  useEffect(() => {
    const throttle = () => {
      let valid = true;
      return () => {
        if (valid) {
          setTimeout(() => {
            // 逻辑处理
            // 总滚动大小 = 总滚动高度 - 视图大小
            const current = thisRef.current;
            if (current) {
              if (document.documentElement.scrollTop !== 0) {
                current.style.visibility = 'visible';
                current.style.opacity = '1';
              } else {
                current.style.visibility = 'hidden';
                current.style.opacity = '0';
              }
            }
            setScrollTop(document.documentElement.scrollTop);
            setScrollHeight(document.documentElement.scrollHeight - window.innerHeight);
            valid = true;
          }, 500);
          valid = false;
        }
      };
    };
    const throttleFunc = throttle();
    window.addEventListener('scroll', throttleFunc);
    return () => {
      window.removeEventListener('scroll', throttleFunc);
    };
  }, [thisRef]);

  return (
    <div
      // className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}
      className={style.wrapper}
      onClick={() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth', // 使用平滑滚动
        });
      }}
      ref={thisRef}
    >
      <svg width={radius * 2} height={radius * 2} className={themeMode === 'dark' ? style.dark : style.light}>
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
};

BackToTopBtn.displayName = 'BackToTopBtn';
export default BackToTopBtn;
