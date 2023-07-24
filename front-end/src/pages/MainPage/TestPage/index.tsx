import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useAppDispatch, useAppSelector } from '@/redux';
import { setIsLoading } from '@/redux/slices/progressbar';
import ProgressBar from '@/components/ProgressBar';

const Test = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.progressbar.isLoading);

  useEffect(() => {
    dispatch(setIsLoading(true));
  }, []);
  return (
    <>
      <div style={{ paddingTop: 100, width: '100vw', height: '100vh' }}>
        <ProgressBar></ProgressBar>
      </div>
    </>
  );
};

export default Test;
