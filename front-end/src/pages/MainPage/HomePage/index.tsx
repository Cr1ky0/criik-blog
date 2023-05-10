import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

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

// comp
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import BlogDetailBox from '@/components/HomePage/BlogDetailBox';
import Footer from '@/components/Footer';
import LoadingComp from '@/components/Universal/LoadingComp';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);
  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
    // 这里延迟展开是因为加载需要时间，不然开始就展开会很卡
    const timer = setTimeout(() => {
      const div = document.getElementById('home-page-wrapper') as HTMLElement;
      div.style.height = window.innerHeight + 'px';
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [width, window.innerHeight]);

  return (
    <div id="home-page-wrapper" className={style.wrapper}>
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
            <LoadingComp styles={{ padding: '5vh' }}></LoadingComp>
          ) : (
            // 路由
            <>
              <Outlet />
              <div className={style.paginate}>
                <Pagination
                  showSizeChanger={false}
                  showQuickJumper
                  pageSize={10}
                  current={curPage}
                  total={totalNum}
                  onChange={page => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 400);
                    // 点击跳转
                    navigate(`?page=${page}`);
                    setCurPage(page);
                  }}
                />
              </div>
            </>
          )}
        </div>
        {width > 1138 ? (
          <div className={style.sider}>
            <div>
              <IntroductionBox></IntroductionBox>
              <BlogDetailBox></BlogDetailBox>
            </div>
          </div>
        ) : undefined}
      </div>
      <Footer></Footer>
    </div>
  );
};
export default HomePage;
