import React, { useEffect } from 'react';

import BlogToc from '@/components/BlogPage/BlogToc';
import { useAppDispatch, useAppSelector } from '@/redux';
import Classification from '@/components/Classification';
import { setTimeLine } from '@/redux/slices/blog';
import BlogTimeLine from '@/components/BlogTimeLine';
import BlogDetailBox from '@/components/HomePage/BlogDetailBox';

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
    <div style={{ margin: '20vh', width: '300px', backgroundColor: '#FFF' }}>
      {/*<BlogToc text={testText}></BlogToc>*/}
      {/*<Classification></Classification>*/}
      {/*<BlogTimeLine></BlogTimeLine>*/}
      <BlogDetailBox></BlogDetailBox>
    </div>
  );
};

export default TestPage;
