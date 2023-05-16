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

// util
import { backToTop, throttle } from '@/utils/backToTopUtil';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);
  const homePhotoWrapper = useRef<HTMLDivElement>(null);

  // Back To Top
  const wrapper = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = wrapper.current as HTMLDivElement;
    const child = childRef.current as HTMLDivElement;

    // 初始化防止初始页面直接满进度
    setScrollHeight(1);
    setScrollTop(0);

    // 节流函数
    const throttleFunc = throttle(current, child, setScrollHeight, setScrollTop);
    current.addEventListener('scroll', throttleFunc);
    return () => {
      current.removeEventListener('scroll', throttleFunc);
    };
  }, []);

  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
  }, []);

  useEffect(() => {
    // 这里延迟展开是因为加载需要时间，不然开始就展开会很卡
    const div = wrapper.current as HTMLDivElement;
    div.style.height = window.innerHeight + 'px';
  }, [width, window.innerHeight]);

  return (
    <div className={`${style.wrapper} clearfix`} ref={wrapper}>
      <Header className={style.backWhite}></Header>
      <div
        className={`${width > 400 ? style.backgroundPhoto : style.backgroundPhotoMobile} clearfix`}
        style={{ backgroundImage: `url(${img1})` }}
        ref={homePhotoWrapper}
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
              <div className={style.blogList}>
                <Outlet />
              </div>
              <div className={style.paginate}>
                <Pagination
                  showSizeChanger={false}
                  showQuickJumper
                  pageSize={10}
                  current={curPage}
                  total={totalNum}
                  onChange={page => {
                    (wrapper.current as HTMLDivElement).scrollTo({
                      top: parseInt(window.getComputedStyle(homePhotoWrapper.current as HTMLDivElement).height),
                      behavior: 'smooth',
                    });
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
      <BackToTopBtn
        ref={childRef}
        scrollTop={scrollTop}
        scrollHeight={scrollHeight}
        onClick={() => {
          backToTop(wrapper.current as HTMLDivElement);
        }}
      ></BackToTopBtn>
      <Footer></Footer>
    </div>
  );
};
export default HomePage;
