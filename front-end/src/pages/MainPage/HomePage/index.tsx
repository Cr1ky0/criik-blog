import React, { useEffect } from 'react';

// css
import style from './index.module.scss';

// img
import img1 from '@/assets/images/home.jpg';
import img2 from '@/assets/images/blog-icon.png';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// redux
import { useAppDispatch } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';

const HomePage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChosenList([true, false, false, false]));
  }, []);
  return (
    <div className={style.wrapper}>
      <div
        className={`${width > 400 ? style.backgroundPhoto : style.backgroundPhotoMobile} clearfix`}
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className={style.homeTagWrapper}>
          <div className={style.homeTagIcon} style={{ backgroundImage: `url(${img2})` }}></div>
          <div className={style.homeTag}>Criik-Blog</div>
          <div>Always Be Yourself and Never Compromise to the Life</div>
        </div>
      </div>
      <div className={style.main}>
        <div className={style.content}>content</div>
        <div className={style.sider}>sider</div>
      </div>
    </div>
  );
};
export default HomePage;
