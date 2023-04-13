import React from 'react';
import { Layout } from 'antd';

import { Outlet } from 'react-router';

const { Footer, Content } = Layout;

// 组件
import TopHeader from '../../components/TopHeader';

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  height: '2000px',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: 'black',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};

const MainPage = () => {
  return (
    <Layout>
      <TopHeader></TopHeader>
      <Layout>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
      </Layout>
      <Footer style={footerStyle}>Footer</Footer>
    </Layout>
  );
};

export default MainPage;
