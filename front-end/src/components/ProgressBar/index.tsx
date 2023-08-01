import React, { useEffect, useState } from 'react';

// 进度条
import { CSSTransition } from 'react-transition-group';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setIsLoading } from '@/redux/slices/progressbar';

const ProgressBar = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.progressbar.isLoading);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 1000);
    }
  }, []);

  useEffect(() => {
    setKey(prevKey => prevKey + 1);
  }, [isLoading]);

  return (
    <>
      <CSSTransition key={key} in={isLoading} timeout={1000} classNames="fade" unmountOnExit>
        <div className={style.progressBar}>
          <div className={style.progress}></div>
        </div>
      </CSSTransition>
    </>
  );
};

export default ProgressBar;
