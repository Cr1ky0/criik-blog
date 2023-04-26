import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

// css
import style from './index.module.scss';

// 组件
import TopHeader from '@/components/TopHeader';

// comp
import Footer from '@/components/Footer';

// antd
import { Layout } from 'antd';
import { isNoScroll } from '@/utils';

const { Content, Header } = Layout;

// redux
import { useAppDispatch } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';
// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { width } = useViewport();
  useEffect(() => {
    // 加载后先把emoji请求回来，后面不再请求了
    dispatch(setEmoji());
  }, [width]);
  return (
    <Layout style={{ paddingRight: isNoScroll() ? '0.5vw' : undefined }}>
      <TopHeader></TopHeader>
      <Header className={style.backWhite}>Header</Header>
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
