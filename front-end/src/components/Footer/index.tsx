import React from 'react';

// css
import style from './index.module.scss';

// img
import img from '@/assets/images/备案图标.png';

// redux
import { useAppSelector } from '@/redux';

const Footer = () => {
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <div className={`${style.footer} ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div className={style.ICInfo}>
        <div className={style.PSIC}>
          <div className={style.ICIcon} style={{ backgroundImage: `url(${img})` }}></div>
          <a
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42050202000801"
            target="_blank"
            rel="noreferrer"
          >
            鄂公网安备 42050202000801号
          </a>
        </div>
        <div className={style.line}>|</div>
        <a className={style.ICP} href="https://beian.miit.gov.cn" rel="noreferrer" target="_blank">
          鄂ICP备2023007665号
        </a>
      </div>
      <div className={style.protocol}>Copyright © Since 2023 Criiky0</div>
    </div>
  );
};
export default Footer;
