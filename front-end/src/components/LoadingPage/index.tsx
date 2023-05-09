import React from 'react';

// antd
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import style from './index.module.scss';

// TODO:替换加载动画
// TODO:添加访问不存在的链接的页面
const antIcon = <LoadingOutlined style={{ fontSize: '50px' }} spin />;
const LoadingPage = () => {
  return (
    <div className={style.wrapper}>
      <div>
        <Spin indicator={antIcon} />
      </div>
    </div>
  );
};

export default LoadingPage;
