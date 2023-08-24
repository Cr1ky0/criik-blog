import React, { CSSProperties } from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setMobileMenuOpen } from '@/redux/slices/universal';

interface MobileTopBtnProps {
  styles?: CSSProperties;
  children: React.ReactNode;
}

const MobileTopBtn: React.FC<MobileTopBtnProps> = ({ children, styles }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const open = useAppSelector(state => state.universal.moblieMenuOpen);
  return (
    <>
      <div className={`${style.content} ${open ? style.contentActive : style.contentHide}`} style={styles}>
        {children}
      </div>
      <div
        className={`${style.mobileMenu} ${themeMode === 'dark' ? style.mobileMenuDark : style.mobileMenuLight}`}
        onClick={() => {
          dispatch(setMobileMenuOpen(!open));
        }}
      >
        <div className="iconfont">&#xe7f4;</div>
      </div>
    </>
  );
};

export default MobileTopBtn;
