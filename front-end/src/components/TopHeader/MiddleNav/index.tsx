import React from 'react';

// css
import style from './index.module.scss';

// ui-c
import LinkBtn from '@/components/Universal/LinkBtn';

const MiddleNav = () => {
  return (
    <div className={style.middleNav}>
      <LinkBtn icon="&#xe600;" seq={0} link={'/'}>
        主页
      </LinkBtn>
      <LinkBtn icon="&#xe60e;" seq={1} link={'/blog'}>
        博客
      </LinkBtn>
      <LinkBtn icon="&#xe896;" seq={2} link={'/manage'}>
        写博客
      </LinkBtn>
      <LinkBtn icon="&#xe7df;" seq={3} link={'/'}>
        精选
      </LinkBtn>
    </div>
  );
};

export default MiddleNav;
