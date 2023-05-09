import React, { CSSProperties } from 'react';

// antd
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// css
import style from './index.module.scss';

// img
import img from '@/assets/images/loading.jpg';

const antIcon = <LoadingOutlined style={{ fontSize: '50px' }} spin />;

interface LoadingCompProps {
  styles?: CSSProperties;
}

const LoadingComp: React.FC<LoadingCompProps> = ({ styles }) => {
  return (
    <div className={style.wrapper} style={styles}>
      <div className={style.photo} style={{ backgroundImage: `url(${img})` }}></div>
      <div className={style.tips}>Loading...</div>
      <div className={style.icon}>
        <Spin indicator={antIcon} />
      </div>
    </div>
  );
};

export default LoadingComp;
