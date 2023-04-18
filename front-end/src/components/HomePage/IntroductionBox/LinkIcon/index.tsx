import React, { CSSProperties } from 'react';

// css
import style from './index.module.scss';

// interface
export interface LinkIconProps {
  icon: string;
  styles?: CSSProperties;
}

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
