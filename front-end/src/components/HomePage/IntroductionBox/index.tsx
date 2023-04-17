import React from 'react';

// css
import style from './index.module.scss';

// interface
import { IntroductionBoxProps } from '@/interface';

// util
import { getLimitString } from '@/utils';
import LinkIcon from './LinkIcon';

import img from '@/assets/images/left-nav-icon.png';

const IntroductionBox: React.FC<IntroductionBoxProps> = props => {
  const { username, signature } = props;
  const limit = 40;
  return (
    <div className={style.wrapper}>
      <div className={`${style.intro} clearfix`}>
        <div className={style.avator} style={{ backgroundImage: `url(${img})` }}></div>
        <div className={style.username}>{username}</div>
        <div className={style.signature}>{getLimitString(limit, signature)}</div>
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
