import React, { CSSProperties, MouseEventHandler } from 'react';

// css
import style from './index.module.scss';

interface LinkBtn2Props {
  children: string;
  className?: string;
  onClick?: MouseEventHandler;
  styles?: CSSProperties;
}

const LinkBtn2: React.FC<LinkBtn2Props> = props => {
  const { children, className, onClick, styles } = props;
  return (
    <div className={`${style.wrapper} ${className}`} onClick={onClick} style={styles}>
      {children}
    </div>
  );
};

export default LinkBtn2;
