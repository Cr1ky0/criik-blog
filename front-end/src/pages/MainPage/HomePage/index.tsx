import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Drawer, Pagination } from 'antd';
import { Header } from 'antd/es/layout/layout';

// css
import style from './index.module.scss';

// img
import img2 from '@/assets/images/blog-icon.webp';

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
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);
  const homePhotoWrapper = useRef<HTMLDivElement>(null);
  // Mobile Menu Open State
  const [open, setOpen] = useState(false);

  // photo
  const [backgroundImage, setBackgroundImage] = useState(null);

  // Back To Top
  const wrapper = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);

  // 导入随机背景图片
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 11) + 1;

    import(`@/assets/images/homephoto-${randomNumber}.png`).then(imageModule => {
      if (!backgroundImage) setBackgroundImage(imageModule.default);
    });
  }, []);

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

  // 这里只会触发修改高度，其他组件不会重新渲染
  useEffect(() => {
    const div = wrapper.current as HTMLDivElement;
    div.style.height = window.innerHeight + 'px';
  }, [width, window.innerHeight]);

  return (
    <div className={`${style.wrapper} clearfix  animate__animated animate__fadeInUp`} ref={wrapper}>
      <div
        className={`${style.backgroundPhoto} clearfix`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        ref={homePhotoWrapper}
      >
        <div className={style.homeTagWrapper}>
          <div className={style.homeTagIcon} style={{ backgroundImage: `url(${img2})` }}></div>
          <div className={style.homeTag}>Criiky0</div>
          <div>Always Be Yourself and Never Compromise to the Life</div>
        </div>
      </div>
      <div className={style.main}>
        <div className={style.content}>
          {/* loading状态 */}
          {loading ? (
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
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
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
      <div
        className={style.mobileMenu}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="iconfont">&#xe7f4;</div>
      </div>
      {/* Mobile Menu */}
      <Drawer
        placement="top"
        open={open}
        maskClosable={true}
        onClose={() => {
          setOpen(false);
        }}
        destroyOnClose={false}
        height="100%"
        rootStyle={{ border: 'none', outline: 'none' }}
      >
        <BlogDetailBox isMobile></BlogDetailBox>
      </Drawer>
      <Footer></Footer>
    </div>
  );
};
export default HomePage;
