import React from 'react';

// css
import style from './index.module.scss';

// ui-c
import LinkBtn2 from '@/components/UI/LinkBtn2';

// img
import img from '@/assets/images/left-nav-icon.png';

const RightNav = () => {
  return (
    <div className={style.rightNavPC}>
      <LinkBtn2>Sing up</LinkBtn2>
      <LinkBtn2>Sign in</LinkBtn2>
      <div className={style.rightNavAvatorPC} style={{ backgroundImage: `url(${img})` }}></div>
    </div>
  );
};

export default RightNav;
