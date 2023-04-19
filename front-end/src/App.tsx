import React from 'react';
import { useRoutes } from 'react-router';
// 重置样式
import 'reset-css';

// css
import './App.scss';

// iconfont
import './assets/iconfont/iconfont.css';

// 路由
import routes from './routes';

// atnd
import { message } from 'antd';

const App = () => {
  const elements = useRoutes(routes);
  message.config({
    top: 50,
    duration: 1,
  });
  return <>{elements}</>;
};

export default App;
