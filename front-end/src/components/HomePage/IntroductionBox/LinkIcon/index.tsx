import React, { CSSProperties } from 'react';

// antd
import { Popover } from 'antd';

// css
import style from './index.module.scss';
import { hr } from '@uiw/react-md-editor';

// interface
export interface LinkIconProps {
  icon: string;
  content: string;
  href?: string;
  styles?: CSSProperties;
}

const LinkIcon: React.FC<LinkIconProps> = props => {
  const { icon, styles, content, href } = props;
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
