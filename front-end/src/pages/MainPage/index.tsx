import React from 'react';
import { Layout } from 'antd';

import { Outlet } from 'react-router';

const { Content } = Layout;

// 组件
import TopHeader from '@/components/TopHeader';

// comp
import Footer from '@/components/Footer';

const MainPage = () => {
  return (
    <Layout>
      <TopHeader></TopHeader>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Footer></Footer>
    </Layout>
  );
};

export default MainPage;
