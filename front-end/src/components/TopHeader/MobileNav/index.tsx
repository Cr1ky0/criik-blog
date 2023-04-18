import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// css
import style from './index.module.scss';

const MobileNav = () => {
  const [active, setActice] = useState(true);
  return (
    <div className={style.wrapper}>
      <div className={style.leftNav}></div>
      {active ? (
        <Link className={style.rightNavActive} to="/" onClick={() => setActice(false)}>
          <div></div>
          <div></div>
          <div></div>
        </Link>
      ) : (
        <Link className={style.rightNavNotActive} to="/" onClick={() => setActice(true)}>
          <div></div>
          <div></div>
          <div></div>
        </Link>
      )}

      <div className={style.menu}></div>
    </div>
  );
};

export default MobileNav;
