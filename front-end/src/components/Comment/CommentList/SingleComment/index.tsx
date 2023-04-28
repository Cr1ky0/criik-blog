import React, { useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Tag } from 'antd';
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// interface
import { commentObj } from '@/interface';

export interface SingleCommentProps {
  info: commentObj;
}

const SingleComment: React.FC<SingleCommentProps> = props => {
  const { info } = props;
  // TODO:后续添加点赞功能
  const { contents, username, brief, time, likes } = info;
  const [isChosen, setIsChosen] = useState(false);
  const [likesNum, setLikesNum] = useState(0);
  const avatar = useAvatar();
  const changeState = () => {
    if (!isChosen) setLikesNum(likesNum + 1);
    else setLikesNum(likesNum - 1);
    setIsChosen(!isChosen);
  };
  return (
    <li className={`${style.wrapper} clearfix`}>
      <div className={`${style.infoWrapper} clearfix`}>
        <div className={style.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className={style.info}>
          <div className={style.infoBox}>
            <div className={style.username}>{username}</div>
            <div className={style.tags}>
              <Tag color="blue">置顶</Tag>
              <Tag color="blue">置顶</Tag>
            </div>
            <div className={style.time}>{time}</div>
          </div>
          <div className={style.likesWrapper}>
            {isChosen ? (
              <div className={`${style.likesOnChosen} iconfont`} onClick={changeState}>
                &#xeca2;
              </div>
            ) : (
              <div className={`${style.likes} iconfont`} onClick={changeState}>
                &#xeca1;
              </div>
            )}
            <div className={`${style.likesNum}`}>{likesNum}</div>
          </div>
        </div>
        <div className={style.signature}>{brief}</div>
      </div>
      <div className={style.comment}>{contents}</div>
    </li>
  );
};

export default SingleComment;
