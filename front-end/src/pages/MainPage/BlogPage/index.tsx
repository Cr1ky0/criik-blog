import React from 'react';

// comp
import SideMenu from '@/components/SideMenu';
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';

// css
import style from './index.module.scss';

//redux
import { useAppSelector } from '@/redux';

const BlogPage = () => {
  const curBlog = useAppSelector(state => state.blog.curBlog);
  const { title, contents } = curBlog;
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.sider}>
        <SideMenu noEdit={true}></SideMenu>
      </div>
      <div className={`${style.content} clearfix`}>
        <div className={style.info}>
          <div className={style.title}>{title}</div>
          <div className={style.blogInfo}>
            <BlogInfo
              statistics={{
                author: 'criiky0',
                time: '2020/1/2',
                views: 100,
                classification: 'test',
              }}
            ></BlogInfo>
          </div>
        </div>
        <div className={style.blogContent}>
          <ReactMarkdownRender>{contents as string}</ReactMarkdownRender>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
