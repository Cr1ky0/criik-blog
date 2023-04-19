import React, { useEffect } from 'react';

// css
import style from './index.module.scss';

// img
import img1 from '@/assets/images/home.jpg';
import img2 from '@/assets/images/blog-icon.png';

// redux
import { useAppDispatch } from '@/redux';
import { setEmoji } from '@/redux/slices/emoji';

const HomePage = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // 加载后先把emoji请求回来，后面不再请求了
    dispatch(setEmoji());
  }, []);
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
