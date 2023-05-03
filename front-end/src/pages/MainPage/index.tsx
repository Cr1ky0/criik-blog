import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

// antd
import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';

// css
import style from './index.module.scss';

// 组件
import TopHeader from '@/components/TopHeader';

// comp
import Footer from '@/components/Footer';

const { Content } = Layout;

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';
import { setMenuList, setTimeLine } from '@/redux/slices/blog';

// gloabal
import { MY_ID } from '@/global';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const chosenList = useAppSelector(state => state.chosenList.chosenList);
  useEffect(() => {
    // 这里加载的全是我个人的博客信息
    // 后续登录后重新获取数据
    // 加载后先把emoji请求回来，后面不再请求了
    dispatch(setEmoji());
    // 请求MyMenu
    dispatch(setMenuList(MY_ID));
    // 请求timeLine
    dispatch(setTimeLine());
  }, []);
  return (
    <Layout>
      <TopHeader></TopHeader>
      {/* 如果是主页就取消Header，因为所有滚动都是在内部wrapper内，而不是body，背景调放在wrapper内才能有滚动 */}
      {chosenList[0] ? undefined : <Header className={style.backWhite}></Header>}
      <Layout>
        <Content>
          <React.StrictMode>
            <Outlet />
          </React.StrictMode>
        </Content>
      </Layout>
      {/*<Footer></Footer>*/}
    </Layout>
  );
};

export default MainPage;
