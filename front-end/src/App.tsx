import React from 'react';
import { useRoutes } from 'react-router';

// antd
import { ConfigProvider, theme } from 'antd';

// 重置样式
// 防止和markdown冲突，自定义reset样式
import './reset.css';

// css
import './App.scss';

// iconfont
import './assets/iconfont/iconfont.css';

// 路由
import routes from './routes';

// global
import { THEME_COLOR, BACKGROUND_COLOR_DARK_2, FONT_COLOR_DARK } from './global';

// redux
import { useAppSelector } from '@/redux';

const App = () => {
  const elements = useRoutes(routes);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <ConfigProvider
      theme={{
        components:
          themeMode === 'dark'
            ? {
                Pagination: { colorBgContainer: BACKGROUND_COLOR_DARK_2, colorText: FONT_COLOR_DARK },
                Layout: {
                  colorBgBody: BACKGROUND_COLOR_DARK_2,
                },
              }
            : undefined,
        token: {
          colorPrimary: THEME_COLOR,
        },
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : undefined,
      }}
    >
      {elements}
    </ConfigProvider>
  );
};

export default App;
