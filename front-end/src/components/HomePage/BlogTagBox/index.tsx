import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// comp
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// util
import { filterMarkdown, getLimitString } from '@/utils';

// interface
import { BlogTagBoxStatistic } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';

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
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const limit = width > BREAK_POINT ? 200 : 100;
  const [str] = useState(getLimitString(limit, filterMarkdown(children)));
  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark-2' : style.light}`}>
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
      <div className={style.text}>{str}</div>
      <div className={style.line}></div>
      <div className={`${style.statistics} clearfix`}>
        <BlogInfo statistics={{ author, time, views, belongingMenu, id, isCollected, likes }}></BlogInfo>
      </div>
    </div>
  );
};

export default BlogTagBox;
