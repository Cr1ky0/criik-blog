import React, { useEffect } from 'react';
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

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch } from '@/redux';

const BackStage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { width } = useViewport();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    dispatch(setChosenList([false, false, false, false]));
  }, []);

  return (
    <>
      <Layout>
        {/*<Header className={style.topBlank}></Header>*/}
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
