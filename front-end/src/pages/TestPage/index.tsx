import React from 'react';

// comp
import BlogTagBox from '@/components/HomePage/BlogTagBox';
import { BlogTagBoxStatistic } from '@/interface';

const TestPage = () => {
  const statistcs: BlogTagBoxStatistic = { author: 'criiky0', views: 200, time: '2023/4/12', classification: 'ts' };
  return (
    <div style={{ margin: '20vh' }}>
      <BlogTagBox title="TESTTITLE" statistics={statistcs}>
        TestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTASTestSTAST
      </BlogTagBox>
    </div>
  );
};

export default TestPage;
