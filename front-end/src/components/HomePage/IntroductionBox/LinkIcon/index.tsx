import React from 'react';

// css
import style from './index.module.scss';

// interface
import { LinkIconProps } from '@/interface';

const LinkIcon: React.FC<LinkIconProps> = props => {
  const { icon, styles } = props;
  return (
    <div className={`${style.wrapper}`}>
      <div className="iconfont" style={styles}>
        {icon}
      </div>
    </div>
  );
};

export default LinkIcon;
