import React, { useEffect } from 'react';
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
import {
  THEME_COLOR,
  BACKGROUND_COLOR_DARK_2,
  FONT_COLOR_DARK,
  BACKGROUND_COLOR_DARK,
  FONT_COLOR_LIGHT,
  FONT_COLOR_LIGHT_2,
} from './global';

// redux
import { useAppSelector } from '@/redux';

const App = () => {
  const elements = useRoutes(routes);
  const themeMode = useAppSelector(state => state.universal.themeMode);

  // html元素黑暗模式设置
  useEffect(() => {
    const html = document.documentElement;
    if (themeMode === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }, [themeMode]);

  return (
    <ConfigProvider
      theme={{
        components:
          themeMode === 'dark'
            ? {
                Pagination: { colorBgContainer: BACKGROUND_COLOR_DARK_2 },
                Timeline: { colorBgContainer: BACKGROUND_COLOR_DARK_2 },
              }
            : {
                Anchor: {
                  colorText: FONT_COLOR_LIGHT_2,
                },
              },
        token:
          themeMode === 'dark'
            ? {
                colorPrimary: THEME_COLOR,
                colorText: FONT_COLOR_DARK,
                colorBgContainer: BACKGROUND_COLOR_DARK,
                colorBgLayout: BACKGROUND_COLOR_DARK,
                colorBgElevated: BACKGROUND_COLOR_DARK_2,
              }
            : {
                colorPrimary: THEME_COLOR,
                colorText: FONT_COLOR_LIGHT,
              },
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : undefined,
      }}
    >
      {elements}
    </ConfigProvider>
  );
};

export default App;
