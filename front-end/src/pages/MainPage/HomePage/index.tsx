import React from 'react';

// css
import style from './index.module.scss';

// img
import img1 from '@/assets/images/home.jpg';
import img2 from '@/assets/images/blog-icon.png';

const HomePage = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.backWhite}></div>
      <div className={`${style.backgroundPhoto} clearfix`} style={{ backgroundImage: `url(${img1})` }}>
        <div className={style.homeTagWrapper}>
          <div className={style.homeTagIcon} style={{ backgroundImage: `url(${img2})` }}></div>
          <div className={style.homeTag}>Criik-Blog</div>
          <div>Always Be Yourself and Never Compromise to the Life</div>
        </div>
      </div>
    </div>
  );
};
export default HomePage;
