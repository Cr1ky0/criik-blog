import React, { useEffect, useState } from 'react';

// comp
import SideMenu from '@/components/SideMenu';
import BlogInfo from '@/components/Universal/BlogInfo';
import ReactMarkdownRender from '@/components/ReactMarkdownRender';
import Comment from '@/components/Comment';

// antd
import { Skeleton, Breadcrumb } from 'antd';

// css
import style from './index.module.scss';

//redux
import { useAppSelector } from '@/redux';

// utils
import { getBreadcrumbList } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';

const BlogPage = () => {
  // TODO:加载动画
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const curBlog = useAppSelector(state => state.blog.curBlog);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const { title, contents } = curBlog;
  const icons = useIcons();
  const breadcrumbList = selectedId ? getBreadcrumbList(menus, selectedId, icons) : undefined;

  useEffect(() => {
    // 初始化动画
    setTimeout(() => {
      setInitLoading(false);
    }, 1000);
  }, []);
  return (
    <div className={`${style.wrapper} clearfix`}>
      {/* 初始化加载动画 */}
      {initLoading ? (
        <div className={style.loadingAnime}>
          <Skeleton active />
          <br />
          <Skeleton active />
          <br />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={style.sider}>
            <SideMenu
              noEdit={true}
              setLoading={(state: boolean) => {
                setLoading(state);
              }}
            ></SideMenu>
          </div>
          <div className={`${style.content} clearfix`}>
            {/* 选中状态 */}
            {selectedId ? (
              /* Content加载状态 */
              loading ? (
                <>
                  <Skeleton active />
                  <br />
                  <Skeleton active />
                  <br />
                  <Skeleton active />
                </>
              ) : (
                <>
                  <div className={style.breadCrumb}>
                    <Breadcrumb
                      items={
                        breadcrumbList
                          ? breadcrumbList.map(item => {
                              return {
                                title: (
                                  <>
                                    {item.icon} {item.title}
                                  </>
                                ),
                              };
                            })
                          : []
                      }
                    />
                  </div>
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
                    <div className={style.text}>
                      <ReactMarkdownRender>{contents as string}</ReactMarkdownRender>
                    </div>
                    <div className={style.blogEdit}>edit</div>
                    <div className={style.comment}>
                      <Comment></Comment>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
export default BlogPage;
