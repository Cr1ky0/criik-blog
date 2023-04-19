import React, { MouseEventHandler } from 'react';

// css
import style from './index.module.scss';

interface LinkBtn2Props {
  children: string;
  className?: string;
  onClick?: MouseEventHandler;
}

const LinkBtn2: React.FC<LinkBtn2Props> = props => {
  const { children, className, onClick } = props;
  return (
    <div className={`${style.wrapper} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default LinkBtn2;
