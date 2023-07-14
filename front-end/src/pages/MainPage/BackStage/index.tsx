import React from 'react';
import { Outlet } from 'react-router';

// antd
import { CodepenOutlined } from '@ant-design/icons';
import { Layout, theme } from 'antd';

const { Header, Sider, Content } = Layout;

// css
import style from './index.module.scss';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';

// comp
import ManageMenu from '@/components/BackStage/ManageMenu';

const BackStage: React.FC = () => {
  const { width } = useViewport();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Layout>
        <Header className={style.topBlank}></Header>
        <Layout className={style.wrapper}>
          <Sider trigger={null} collapsible collapsed={width < BREAK_POINT} width="15vw" theme="light">
            <div className={style.logo}>
              <CodepenOutlined />
              Manage
            </div>
            <ManageMenu></ManageMenu>
          </Sider>

          <Content
            className={style.content}
            style={{
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default BackStage;
