import React from 'react';

// css
import style from './index.module.scss';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';

// util
import { getLimitString } from '@/utils';

export interface BlogTagBoxProps {
  children: string;
  title: string;
}

// 主页的BlogBox组件
const BlogTagBox: React.FC<BlogTagBoxProps> = props => {
  const { children, title } = props;
  const limit = 400; // 超过400字加`...`
  return (
    <div className={style.wrapper}>
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
        <BlogInfo statistics={{ author: 'criiky0', time: '2020/1/2', views: 100, classification: 'test' }}></BlogInfo>
      </div>
    </div>
  );
};

export default BlogTagBox;
