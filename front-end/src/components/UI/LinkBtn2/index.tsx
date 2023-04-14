import React from 'react';

// css
import style from './index.module.scss';

interface LinkBtn2Props {
  children: string;
  className?: string;
}

const LinkBtn2: React.FC<LinkBtn2Props> = props => {
  const { children, className } = props;
  return <div className={`${style.wrapper} ${className}`}>{children}</div>;
};

export default LinkBtn2;
