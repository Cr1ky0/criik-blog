import React from 'react';

// css
import style from './index.module.scss';

// interface
import { IntroductionBoxProps } from '@/interface';

// util
import { getLimitString } from '@/utils';
import LinkIcon from './LinkIcon';

const IntroductionBox: React.FC<IntroductionBoxProps> = props => {
  const { username, signature, icon } = props;
  const limit = 40;
  return (
    <div className={style.wrapper}>
      <div className={`${style.intro} clearfix`}>
        <div className={style.avator}></div>
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
        <LinkIcon icon="&#xe62c;" styles={{ color: '#5eaade' }}></LinkIcon>
        <LinkIcon icon="&#xe635;"></LinkIcon>
        <LinkIcon icon="&#xe686;"></LinkIcon>
      </div>
    </div>
  );
};

export default IntroductionBox;
