import React, { useEffect, useMemo, useState } from 'react';
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
import { useAppDispatch } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';

// comp
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import { getHomePageBlogNum } from '@/api/blog';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const HomePage = () => {
  const navigate = useNavigate();
  const { width } = useViewport();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [totalNum, setTotalNum] = useState(0);
  useMemo(() => {
    getHomePageBlogNum().then(
      res => {
        setTotalNum(res.data.length);
      },
      err => {
        message.error(err.message);
      }
    );
  }, []);
  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
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
            // 路由
            <>
              <Outlet />
              <div className={style.paginate}>
                <Pagination
                  showSizeChanger={false}
                  showQuickJumper
                  pageSize={3}
                  current={curPage}
                  total={totalNum}
                  onChange={page => {
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 400);
                    // 点击跳转
                    navigate(`?page=${curPage}`);
                    setCurPage(page);
                  }}
                />
              </div>
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
