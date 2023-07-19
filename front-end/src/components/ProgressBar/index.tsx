import React from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setIsLoading } from '@/redux/slices/progressbar';

let timer: string | number | NodeJS.Timeout | undefined;
const ProgressBar = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.progressbar.isLoading);
  return (
    <div
      className={style.progressBar}
      style={{
        display: isLoading
          ? (() => {
              // 1s后自动关闭
              if (timer) clearTimeout(timer);
              timer = setTimeout(() => {
                dispatch(setIsLoading(false));
              }, 1000);

              return 'block';
            })()
          : 'none',
      }}
    >
      <div className={style.progress}></div>
    </div>
  );
};

export default ProgressBar;
