import React from 'react';

// css
import './index.scss';

// ui-c
import LinkBtn2 from '@/components/UI/LinkBtn2';

// img
import img from '@/assets/images/left-nav-icon.png';

const RightNav = () => {
  return (
    <div className="right-nav">
      <LinkBtn2>Sing up</LinkBtn2>
      <LinkBtn2>Sign in</LinkBtn2>
      <div className="right-nav-avator" style={{ backgroundImage: `url(${img})` }}></div>
    </div>
  );
};

export default RightNav;
