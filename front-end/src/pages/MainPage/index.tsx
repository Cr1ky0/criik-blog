import React from 'react';
import { Outlet } from 'react-router';

// 组件
import TopHeader from '@/components/TopHeader';

// comp
import Footer from '@/components/Footer';

// antd
import { Layout } from 'antd';

const { Content } = Layout;
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
