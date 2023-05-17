import React from 'react';

// css
import style from './index.module.scss';

const Footer = () => {
  return (
    <>
      <div className={style.footer}>
        <div>
          <a className={style.ICP} href="https://beian.miit.gov.cn" rel="noreferrer" target="_blank">
            备案号：鄂ICP备2023007665号
          </a>
          <span> | </span>
          <span className={`${style.icon} iconfont`}>&#xea0a;</span>
          <a className={style.github} href="https://github.com/Creekyu" target="_blank" rel="noreferrer">
            Github
          </a>
        </div>
        <div className={style.protocol}>Copyright © Since 2023 Criiky0</div>
      </div>
    </>
  );
};
export default Footer;
