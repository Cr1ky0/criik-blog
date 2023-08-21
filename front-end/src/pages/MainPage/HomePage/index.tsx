import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Drawer, Pagination } from 'antd';

// css
import style from './index.module.scss';

// img
import img2 from '@/assets/images/blog-icon.webp';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { setIsLoading } from '@/redux/slices/progressbar';

// comp
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import BlogDetailBox from '@/components/HomePage/BlogDetailBox';
import Footer from '@/components/Footer';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const [search] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [curPage, setCurPage] = useState(search.get('page') ? parseInt(search.get('page') as string) : 1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const homePhotoWrapper = useRef<HTMLDivElement>(null);
  const divRef = useRef<HTMLDivElement>(null);

  // Mobile Menu Open State
  const [open, setOpen] = useState(false);

  // photo
  const [backgroundImage, setBackgroundImage] = useState(null);

  // 导入随机背景图片
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 11) + 1;

    import(`@/assets/images/homephoto-${randomNumber}.png`).then(imageModule => {
      if (!backgroundImage) setBackgroundImage(imageModule.default);
    });
  }, []);

  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
  }, []);

  // 打开滚动条
  useEffect(() => {
    // 如果先前打开了滚动条要先关闭
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <div className={`${style.wrapper} clearfix  show-anime-delay-1s ${themeMode === 'dark' ? 'dark' : ''}`}>
        <div
          className={`${style.backgroundPhoto} clearfix`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
          ref={homePhotoWrapper}
        >
          <div className={style.homeTagWrapper}>
            <div className={style.homeTagIcon} style={{ backgroundImage: `url(${img2})` }}></div>
            <div className={style.homeTag}>𝓒𝓻𝓲𝓲𝓴𝔂𝓞</div>
            <div>Always Be Yourself and Never Compromise to the Life</div>
          </div>
        </div>
        <div className={`${style.main} clearfix`} ref={divRef}>
          <div className={`${style.content}  ${loading ? 'hideAnime' : 'showAnime'}`}>
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
                  window.scrollTo({
                    top: parseInt(window.getComputedStyle(homePhotoWrapper.current as HTMLDivElement).height) + 0.5,
                    behavior: 'smooth',
                  });
                  setLoading(true);
                  setTimeout(() => {
                    // 点击跳转
                    navigate(`?page=${page}`);
                    setCurPage(page);
                    setLoading(false);
                  }, 500);
                }}
              />
            </div>
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
      <div
        className={`${style.mobileMenu} ${themeMode === 'dark' ? style.mobileMenuDark : style.mobileMenuLight}`}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="iconfont">&#xe7f4;</div>
      </div>
    </>
  );
};
export default HomePage;
