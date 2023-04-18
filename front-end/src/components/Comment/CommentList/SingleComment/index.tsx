import React, { useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Tag } from 'antd';

// interface
import { SingleCommentProps } from '@/interface';

// img
import img from '@/assets/images/left-nav-icon.png';

const SingleComment: React.FC<SingleCommentProps> = props => {
  const [isChosen, setIsChosen] = useState(false);
  const [likesNum, setLikesNum] = useState(0);
  const { children } = props;
  const changeState = () => {
    if (!isChosen) setLikesNum(likesNum + 1);
    else setLikesNum(likesNum - 1);
    setIsChosen(!isChosen);
  };
  return (
    <li className={`${style.wrapper} clearfix`}>
      <div className={`${style.infoWrapper} clearfix`}>
        <div className={style.avator} style={{ backgroundImage: `url(${img})` }}></div>
        <div className={style.info}>
          <div className={style.infoBox}>
            <div className={style.username}>Username</div>
            <div className={style.tags}>
              <Tag color="blue">置顶</Tag>
              <Tag color="blue">置顶</Tag>
            </div>
            <div className={style.time}>2023-1-1</div>
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
        <div className={style.signature}>signature</div>
      </div>
      <div className={style.comment}>{children}</div>
    </li>
  );
};

export default SingleComment;
