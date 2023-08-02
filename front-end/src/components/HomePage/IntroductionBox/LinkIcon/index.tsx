import React, { CSSProperties } from 'react';

// antd
import { Popover } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppSelector } from '@/redux';

// interface
export interface LinkIconProps {
  icon: string;
  content: string;
  href?: string;
  styles?: CSSProperties;
}

const LinkIcon: React.FC<LinkIconProps> = props => {
  const { icon, styles, content, href } = props;
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <Popover content={content} placement="bottom">
      <a className={`${style.wrapper}`} href={href} rel="noreferrer" target="_blank">
        <div className="iconfont" style={styles}>
          {icon}
        </div>
      </a>
    </Popover>
  );
};

export default LinkIcon;
