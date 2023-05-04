import React from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';

// util
import { getLimitString } from '@/utils';

// interface
import { BlogTagBoxStatistic } from '@/interface';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';

export interface BlogTagBoxProps {
  children: string;
  title: string;
  blogId: string;
  statistic: BlogTagBoxStatistic;
}

// 主页的BlogBox组件
const BlogTagBox: React.FC<BlogTagBoxProps> = props => {
  const { children, title, statistic, blogId } = props;
  const { author, time, views, belongingMenu, id, isCollected, likes } = statistic;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const limit = 400; // 超过400字加`...`
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.titleWrapper}>
        <div
          className={style.title}
          onClick={() => {
            dispatch(setSelectedId(blogId));
            navigate('/blog');
          }}
        >
          {title}
          <div className={style.bar}></div>
        </div>
        <div className={`${style.pin} iconfont`}>&#xe637;</div>
      </div>
      <div className={style.text}>{getLimitString(limit, children)}</div>
      <div className={style.line}></div>
      <div className={`${style.statistics} clearfix`}>
        <BlogInfo statistics={{ author, time, views, belongingMenu, id, isCollected, likes }}></BlogInfo>
      </div>
    </div>
  );
};

export default BlogTagBox;
