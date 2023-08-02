import React, { CSSProperties, MouseEventHandler } from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

interface LinkBtn2Props {
  children: string;
  className?: string;
  onClick?: MouseEventHandler;
  styles?: CSSProperties;
}

const LinkBtn2: React.FC<LinkBtn2Props> = props => {
  const { children, className, onClick, styles } = props;
  const themeMode = useAppSelector(state => state.universal.themeMode);

  return (
    <div
      className={`${style.wrapper} ${className}  ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}
      onClick={onClick}
      style={styles}
    >
      {children}
    </div>
  );
};

export default LinkBtn2;
