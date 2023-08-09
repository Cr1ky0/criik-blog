import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

// antd
import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';

// css
import style from './index.module.scss';

// 组件
import TopHeader from '@/components/TopHeader';
import ProgressBar from '@/components/ProgressBar';
import BackToTopBtn from '@/components/Universal/BackToTopBtn';

const { Content } = Layout;

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';
import { setMenuList } from '@/redux/slices/blogMenu';
import { setMyBlogsNum } from '@/redux/slices/blog';
import LoginForm from '@/components/TopHeader/LoginForm';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const loginFormOpen = useAppSelector(state => state.universal.loginFormOpen);
  useEffect(() => {
    // 加载后先把emoji请求回来，后面不再请求了
    dispatch(setEmoji());
    // 请求MyMenu
    dispatch(setMenuList());
    // 获取我的博客数
    dispatch(setMyBlogsNum());
  }, []);
  return (
    <Layout>
      <TopHeader></TopHeader>
      {/* Login界面，这里放这是因为css的backdrop-filter在使用了position:fixed以后只对其父元素生效 */}
      {loginFormOpen ? <LoginForm></LoginForm> : undefined}
      <div
        className={style.progress}
        style={{
          backgroundColor: themeMode === 'light' ? undefined : 'rgba(0, 0, 0, .7)',
        }}
      >
        <ProgressBar></ProgressBar>
      </div>

      {/* 如果是主页就取消Header，因为所有滚动都是在内部wrapper内，而不是body，背景调放在wrapper内才能有滚动 */}
      {/*{chosenList[0] ? undefined : <Header className={style.backWhite}></Header>}*/}
      <Header className={style.backWhite}></Header>
      <Layout>
        <Content>
          <React.StrictMode>
            <BackToTopBtn></BackToTopBtn>
            <Outlet />
          </React.StrictMode>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainPage;
