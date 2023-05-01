import React, { useEffect, useState } from 'react';
import moment from 'moment';

// antd
import { Pagination, Skeleton } from 'antd';
import { Header } from 'antd/es/layout/layout';

// css
import style from './index.module.scss';

// img
import img1 from '@/assets/images/home.jpg';
import img2 from '@/assets/images/blog-icon.png';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { setCurPage, setHomePageBlogs } from '@/redux/slices/blog';

// comp
import BlogTagBox from '@/components/HomePage/BlogTagBox';
import IntroductionBox from '@/components/HomePage/IntroductionBox';

const HomePage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const blogs = useAppSelector(state => state.blog.homePageBlogs);
  const curPage = useAppSelector(state => state.blog.curPage);
  const homePageBlogLength = useAppSelector(state => state.blog.homePageBlogLength);
  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
    dispatch(setHomePageBlogs(curPage));
  }, []);

  return (
    <div className={style.wrapper}>
      <Header className={style.backWhite}></Header>
      <div
        className={`${width > 400 ? style.backgroundPhoto : style.backgroundPhotoMobile} clearfix`}
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className={style.homeTagWrapper}>
          <div className={style.homeTagIcon} style={{ backgroundImage: `url(${img2})` }}></div>
          <div className={style.homeTag}>Criik-Blog</div>
          <div>Always Be Yourself and Never Compromise to the Life</div>
        </div>
      </div>
      <div className={style.main}>
        <div className={style.content}>
          {/* loading状态 */}
          {isLoading ? (
            <div style={{ padding: '5vh' }}>
              <Skeleton active />
              <br />
              <Skeleton active />
            </div>
          ) : (
            // content
            <>
              {blogs && blogs.length ? (
                <>
                  {blogs.map(blog => {
                    const { id, title, contents, author, publishAt, views, belongingMenu } = blog;
                    return (
                      <div key={id} style={{ paddingBottom: '3vh' }}>
                        <BlogTagBox
                          title={title}
                          statistic={{
                            author: author as string,
                            time: moment(publishAt).format('YYYY-MM-DD'),
                            views: views as number,
                            belongingMenu,
                          }}
                        >
                          {contents as string}
                        </BlogTagBox>
                      </div>
                    );
                  })}
                  <div className={style.paginate}>
                    <Pagination
                      showSizeChanger={false}
                      showQuickJumper
                      pageSize={10}
                      current={curPage}
                      total={homePageBlogLength}
                      onChange={page => {
                        setIsLoading(true);
                        setTimeout(() => {
                          setIsLoading(false);
                        }, 500);
                        dispatch(setCurPage(page));
                        dispatch(setHomePageBlogs(page));
                      }}
                    />
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '20px', textAlign: 'center' }}>当前没有博客...</div>
              )}
            </>
          )}
        </div>
        <div className={style.sider}>
          <div>
            <IntroductionBox></IntroductionBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
