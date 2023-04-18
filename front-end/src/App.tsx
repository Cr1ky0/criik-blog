import React from 'react';
import { useRoutes } from 'react-router';
// 重置样式
import 'reset-css';

// css
import './App.scss';

// iconfont
import './assets/iconfont/iconfont.css';

// comp
import ViewportProvider from './components/ViewportProvider';

// 路由
import routes from './routes';

const App = () => {
  const elements = useRoutes(routes);
  return <ViewportProvider>{elements}</ViewportProvider>;
};

export default App;
