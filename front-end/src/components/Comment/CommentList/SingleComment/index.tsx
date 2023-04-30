import React, { useCallback, useEffect, useState } from 'react';

// antd
import { Tag } from 'antd';

// css
import style from './index.module.scss';

// interface
import { commentObj } from '@/interface';
import { avatarAjax, getAvatarOfUser } from '@/api/user';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// img
import img from '@/assets/images/default.png';

export interface SingleCommentProps {
  info: commentObj;
}

const SingleComment: React.FC<SingleCommentProps> = props => {
  const { info } = props;
  const message = useGlobalMessage();
  // TODO:后续添加点赞功能
  const { contents, username, brief, time, userId, likes } = info;
  const [isChosen, setIsChosen] = useState(false);
  const [likesNum, setLikesNum] = useState(0);
  const [avatar, setAvatar] = useState(img);
  // 获取当前评论用户的头像
  const getUserAvatarById = useCallback(async (id: string) => {
    const res = await getAvatarOfUser(id);
    await avatarAjax(
      res.data.avatar,
      response => {
        const reader = new FileReader();
        reader.onload = e => {
          if (e.target) setAvatar(e.target.result as string);
        };
        reader.readAsDataURL(response);
      },
      msg => {
        message.error(msg);
      }
    );
  }, []);
  getUserAvatarById(userId);
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
            {/*<div className={style.tags}>*/}
            {/*  <Tag color="blue">置顶</Tag>*/}
            {/*  <Tag color="blue">置顶</Tag>*/}
            {/*</div>*/}
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
