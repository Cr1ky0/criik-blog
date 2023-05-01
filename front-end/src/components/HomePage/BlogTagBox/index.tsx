import React from 'react';

// css
import style from './index.module.scss';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// util
import { getLimitString } from '@/utils';

// interface
import { BlogTagBoxStatistic } from '@/interface';

export interface BlogTagBoxProps {
  children: string;
  title: string;
  statistic: BlogTagBoxStatistic;
}

// 主页的BlogBox组件
const BlogTagBox: React.FC<BlogTagBoxProps> = props => {
  const { children, title, statistic } = props;
  const { author, time, views, belongingMenu } = statistic;
  const limit = 400; // 超过400字加`...`
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.titleWrapper}>
        <div className={style.title}>
          {title}
          <div className={style.bar}></div>
        </div>
        <div className={`${style.pin} iconfont`}>&#xe637;</div>
      </div>
      <div className={style.text}>{getLimitString(limit, children)}</div>
      <div className={style.line}></div>
      <div className={`${style.statistics} clearfix`}>
        <BlogInfo statistics={{ author, time, views, belongingMenu }}></BlogInfo>
      </div>
    </div>
  );
};

export default BlogTagBox;
