import React from 'react';
import { useNavigate } from 'react-router';

// antd
import { Button } from 'antd';

// css
import style from '../index.module.scss';

// img
import img from '@/assets/images/403.jpg';

// redux
import { useAppSelector } from '@/redux';

const Page403: React.FC = () => {
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div>
        <div className={style.photo} style={{ backgroundImage: `url(${img})` }}></div>
        <div className={style.tips}>没有权限访问~ 403</div>
        <div className={style.btn}>
          <Button
            type="primary"
            onClick={() => {
              navigate(-1);
            }}
          >
            返回
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Page403;
