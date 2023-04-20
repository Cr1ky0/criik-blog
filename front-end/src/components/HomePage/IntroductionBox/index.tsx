import React, { CSSProperties } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// util
import { getLimitString } from '@/utils';
import LinkIcon from './LinkIcon';

// hooks
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// interface
export interface IntroductionBoxProps {
  isMobile?: boolean;
  styles?: CSSProperties;
}

const IntroductionBox: React.FC<IntroductionBoxProps> = props => {
  const { isMobile, styles } = props;
  const avatar = useAvatar();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const limit = 40;
  return (
    <div className={style.wrapper} style={isMobile ? Object.assign({ boxShadow: 'none' }, styles) : styles}>
      <div className={`${style.intro} clearfix`}>
        <div className={style.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className={style.username}>{user ? user.name : 'Criiky0'}</div>
        <div className={style.signature}>{user ? getLimitString(limit, user.brief) : '这个人很懒，没有个性签名~'}</div>
      </div>
      <div className={style.blogInfo}>
        <div>
          <div>700</div>
          <div>文章</div>
        </div>
        <div>
          <div>700</div>
          <div>分类</div>
        </div>
        <div>
          <div>700</div>
          <div>标签</div>
        </div>
        <div>
          <div>700</div>
          <div>时间轴</div>
        </div>
      </div>
      <div className={`${style.linkBox} clearfix`}>
        <LinkIcon icon="&#xea0a;"></LinkIcon>
        <LinkIcon icon="&#xe66a;" styles={{ color: '#5eaade' }}></LinkIcon>
        <LinkIcon icon="&#xe686;" styles={{ color: '#13227a' }}></LinkIcon>
      </div>
    </div>
  );
};

export default IntroductionBox;
