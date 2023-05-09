import React, { useEffect } from 'react';

import BlogToc from '@/components/BlogPage/BlogToc';
import { useAppDispatch, useAppSelector } from '@/redux';
import Classification from '@/components/HomePage/BlogDetailBox/Classification';
import { setTimeLine } from '@/redux/slices/blog';
import BlogTimeLine from '@/components/HomePage/BlogDetailBox/BlogTimeLine';
import BlogDetailBox from '@/components/HomePage/BlogDetailBox';
import LoadingPage from '@/components/LoadingPage';
import Page404 from '@/components/Page404';
import LoadingComp from '@/components/Universal/LoadingComp';

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
    // <div style={{ margin: '20vh', width: '300px', backgroundColor: '#FFF' }}>
    <div>
      {/*<BlogToc text={testText}></BlogToc>*/}
      {/*<Classification></Classification>*/}
      {/*<BlogTimeLine></BlogTimeLine>*/}
      {/*<LoadingPage></LoadingPage>*/}
      {/*<Page404></Page404>*/}
      {/*<BlogDetailBox></BlogDetailBox>*/}
      <LoadingComp></LoadingComp>
    </div>
  );
};

export default TestPage;
