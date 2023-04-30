import React, { useMemo, useState } from 'react';

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

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeId, delLikeId } from '@/redux/slices/comments';

// util
import { isLike } from '@/utils';

export interface SingleCommentProps {
  info: commentObj;
}

const SingleComment: React.FC<SingleCommentProps> = props => {
  const { info } = props;
  const message = useGlobalMessage();
  // TODO:后续添加点赞功能
  const { contents, username, brief, time, userId, likes, id } = info;
  // 利用likeList判断当前评论的id是否在其中来记录点赞状态
  const likeList = useAppSelector(state => state.comments.likeList);
  const isChosen = isLike(likeList, id);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState(img);
  // 获取当前评论用户的头像
  useMemo(() => {
    const getUserAvatarById = async (id: string) => {
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
    };
    getUserAvatarById(userId);
  }, []);
  const handleClick = () => {
    if (!isChosen) {
      dispatch(addLikeId(id));
    } else {
      dispatch(delLikeId(id));
    }
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
              <div className={`${style.likesOnChosen} iconfont`} onClick={handleClick}>
                &#xeca2;
              </div>
            ) : (
              <div className={`${style.likes} iconfont`} onClick={handleClick}>
                &#xeca1;
              </div>
            )}
            <div className={`${style.likesNum}`}>{likes}</div>
          </div>
        </div>
        <div className={style.signature}>{brief}</div>
      </div>
      <div className={style.comment}>{contents}</div>
    </li>
  );
};

export default SingleComment;
