import React from 'react';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/redux';
import { setIsLoading } from '@/redux/slices/progressbar';

const Test = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.progressbar.isLoading);
  return (
    <>
      <div
        style={{ paddingTop: 100, width: '100vw', height: '100vh' }}
        className="animate__animated animate__fadeInUp animate__delay-1s"
      >
        {/*<ProgressBar></ProgressBar>*/}
        <Button
          onClick={() => {
            dispatch(setIsLoading(!isLoading));
          }}
        >
          Switch
        </Button>
        <div>{isLoading ? '显示' : '关闭'}</div>
      </div>
    </>
  );
};

export default Test;
