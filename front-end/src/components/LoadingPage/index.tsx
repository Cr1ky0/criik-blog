import React from 'react';

// antd
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

// global
import { BACKGROUND_COLOR_DARK } from '@/global';

const antIcon = <LoadingOutlined style={{ fontSize: '50px' }} spin />;
const LoadingPage = () => {
  const themeMode = useAppSelector(state => state.universal.themeMode);

  return (
    <div className={style.wrapper} style={{ backgroundColor: themeMode === 'dark' ? BACKGROUND_COLOR_DARK : '#FFF' }}>
      <div>
        <Spin indicator={antIcon} />
      </div>
    </div>
  );
};

export default LoadingPage;
