import React, { CSSProperties } from 'react';

// antd
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

const antIcon = <LoadingOutlined style={{ fontSize: '50px' }} spin />;

interface LoadingCompProps {
  styles?: CSSProperties;
}

const LoadingComp: React.FC<LoadingCompProps> = ({ styles }) => {
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? 'dark' : 'light'}`} style={styles}>
      <div className={style.tips}>Loading...</div>
      <div className={style.icon}>
        <Spin indicator={antIcon} />
      </div>
    </div>
  );
};

export default LoadingComp;
