import React from 'react';

import BlogToc from '@/components/BlogPage/BlogToc';
import { useAppSelector } from '@/redux';
import Classification from '@/components/HomePage/Classification';

const TestPage = () => {
  const testText = `
  # 第一分段 
  测试1 
  # 第二分段 
  测试2 
  # 第三分段 
  测试3
`;
  const curBlog = useAppSelector(state => state.blog.curBlog);
  return (
    <div style={{ margin: '20vh', width: '200px', backgroundColor: '#FFF' }}>
      {/*<BlogToc text={testText}></BlogToc>*/}
      <Classification></Classification>
    </div>
  );
};

export default TestPage;
