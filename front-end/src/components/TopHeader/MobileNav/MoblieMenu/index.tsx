import React from 'react';
// css
import style from './index.module.scss';

// redux
import LinkBtn from '@/components/UI/LinkBtn';
import IntroductionBox from '@/components/HomePage/IntroductionBox';

// hooks
import { useViewport } from '@/components/ViewportProvider';

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = props => {
  const { isOpen } = props;
  const { height } = useViewport();
  const limit = height - 50;
  return (
    <div className={style.menu} style={{ display: isOpen ? 'block' : 'none', height: `${limit}px` }}>
      <div className={style.wrapper}>
        <div className={style.menuWrapper}>
          <LinkBtn icon="&#xe600;" seq={0} link={'/'} notAnimation={true}>
            主页
          </LinkBtn>
          <LinkBtn icon="&#xe60e;" seq={1} link={'/test'} notAnimation={true}>
            博客
          </LinkBtn>
          <LinkBtn icon="&#xe896;" seq={2} link={'/'} notAnimation={true}>
            写博客
          </LinkBtn>
          <LinkBtn icon="&#xe7df;" seq={3} link={'/'} notAnimation={true}>
            精选
          </LinkBtn>
        </div>
        <div className={style.introWrapper}>
          <IntroductionBox username={'Criiky0'} signature={'ASDASDAS'} isMobile={true}></IntroductionBox>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
