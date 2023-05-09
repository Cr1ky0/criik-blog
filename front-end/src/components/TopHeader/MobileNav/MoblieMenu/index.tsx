import React from 'react';
// css
import style from './index.module.scss';

// redux
import LinkBtn from '@/components/Universal/LinkBtn';
import IntroductionBox from '@/components/HomePage/IntroductionBox';

interface MobileMenuProps {
  isOpen: boolean;
  close: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = props => {
  const { isOpen, close } = props;
  return (
    <div id="mobile-menu-wrapper" className={isOpen ? style.menuOnOpen : style.menuOnClose}>
      <div className={style.wrapper}>
        <div className={style.menuWrapper}>
          <LinkBtn icon="&#xe600;" seq={0} link={'/'} notAnimation={true} onClick={close}>
            主页
          </LinkBtn>
          <LinkBtn icon="&#xe60e;" seq={1} link={'/blog'} notAnimation={true} onClick={close}>
            博客
          </LinkBtn>
          <LinkBtn icon="&#xe896;" seq={2} link={'/manage'} notAnimation={true} onClick={close}>
            管理
          </LinkBtn>
          <LinkBtn icon="&#xe7df;" seq={3} link={'/stars'} notAnimation={true} onClick={close}>
            精选
          </LinkBtn>
        </div>
        <div className={style.introWrapper}>
          <IntroductionBox isMobile={true}></IntroductionBox>
        </div>
      </div>
    </div>
  );
};
export default MobileMenu;
