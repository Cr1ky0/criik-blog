import React, { useEffect } from 'react';

import BlogToc from '@/components/BlogPage/BlogToc';
import { useAppDispatch, useAppSelector } from '@/redux';
import Classification from '@/components/HomePage/Classification';
import { setTimeLine } from '@/redux/slices/blog';

const TestPage = () => {
  const testText = `
  # 第一分段 
  测试1 
  # 第二分段 
  测试2 
  # 第三分段 
  测试3
`;
  const timeLine = useAppSelector(state => state.blog.timeLine);
  const dispatch = useAppDispatch();

  return (
    <div style={{ margin: '20vh', width: '200px', backgroundColor: '#FFF' }}>
      {/*<BlogToc text={testText}></BlogToc>*/}
      <Classification></Classification>
    </div>
  );
};

export default TestPage;
