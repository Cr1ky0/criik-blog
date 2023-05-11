import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Pagination } from 'antd';
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
import BackToTopBtn from '@/components/Universal/BackToTopBtn';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);

  // Back To Top
  const wrapper = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);
  const backToTop = () => {
    (wrapper.current as HTMLDivElement).scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const current = wrapper.current as HTMLDivElement;
    const child = childRef.current as HTMLDivElement;

    // 初始化防止初始页面直接满进度
    setScrollHeight(1);
    setScrollTop(0);

    const handler = () => {
      // 总滚动大小 = 总滚动高度 - 视图大小
      if (current.scrollTop !== 0) {
        child.style.visibility = 'visible';
        child.style.opacity = '1';
      } else {
        child.style.visibility = 'hidden';
        child.style.opacity = '0';
      }
      setScrollHeight(current.scrollHeight - current.offsetHeight);
      setScrollTop(current.scrollTop);
    };
    current.addEventListener('scroll', handler);
    return () => {
      current.removeEventListener('scroll', handler);
    };
  }, []);

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
    <div id="home-page-wrapper" className={style.wrapper} ref={wrapper}>
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
      <BackToTopBtn ref={childRef} scrollTop={scrollTop} scrollHeight={scrollHeight} onClick={backToTop}></BackToTopBtn>
      <Footer></Footer>
    </div>
  );
};
export default HomePage;
