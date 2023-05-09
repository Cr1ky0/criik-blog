import React from 'react';

// css
import style from './index.module.scss';

const Footer = () => {
  return (
    <>
      <div className={style.footer}>
        <div>
          <span className={style.ICP}>ICP</span>
          <span> | </span>
          <span className="iconfont">&#xea0a;</span>
          <span className={style.github}>github</span>
        </div>
        <div className={style.protocol}>Protocol</div>
      </div>
    </>
  );
};
export default Footer;
