import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import moment from 'moment/moment';

// antd
import { Tag } from 'antd';

// css
import style from './index.module.scss';

// interface
import { ReplyApiObj } from '@/interface';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// img
import img from '@/assets/images/default.webp';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeId, delLikeId, delReply, updateReply } from '@/redux/slices/comments';

// util
import { isLike } from '@/utils';

//api
import { avatarAjax, getAvatarOfUser } from '@/api/user';
import { updateReplyAjax, deleteReplyAjax } from '@/api/reply';

export interface SingleReplyProps {
  reply: ReplyApiObj;
  noLikes?: boolean;
}

const SingleComment: React.FC<SingleReplyProps> = ({ reply, noLikes }) => {
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const {
    contents,
    username,
    brief,
    publishAt,
    belongingUser: userId,
    likes,
    _id: id,
    userRole,
    belongingComment,
  } = reply;
  // 利用likeList判断当前评论的id是否在其中来记录点赞状态
  const likeList = useAppSelector(state => state.comments.likeList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const isChosen = isLike(likeList, id);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState(img);
  // cookies
  const cookies = new Cookies();
  const user = cookies.get('user');

  const handleDel = () => {
    modal.confirm({
      title: '提示',
      content: '是否删除该评论？',
      onOk: async () => {
        await deleteReplyAjax(
          id,
          () => {
            message.success('删除成功');
            dispatch(delReply({ id, belongingComment }));
          },
          msg => {
            message.error(msg);
          }
        );
      },
    });
  };

  // 获取当前评论用户的头像
  useEffect(() => {
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

  const handleClick = async () => {
    if (!isChosen) {
      dispatch(addLikeId(id));
      await updateReplyAjax(
        { id, likes: likes + 1 },
        data => {
          const updatedComment = data.data.updatedComment;
          dispatch(updateReply({ id, belongingComment, data: { likes: updatedComment.likes } }));
        },
        msg => {
          message.error(msg);
        }
      );
    } else {
      dispatch(delLikeId(id));
      await updateReplyAjax(
        { id, likes: likes - 1 },
        data => {
          const updatedComment = data.data.updatedComment;
          dispatch(updateReply({ id, belongingComment, data: { likes: updatedComment.likes } }));
        },
        msg => {
          message.error(msg);
        }
      );
    }
  };

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div
        className={`${style.infoWrapper} clearfix ${
          themeMode === 'dark' ? style.infoWrapperDark : style.infoWrapperLight
        }`}
      >
        <div className={style.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className={style.info}>
          <div className={style.infoBox}>
            <div className={style.username}>{username}</div>
            <div className={style.tags}>
              {userRole === 'admin' ? <Tag color="red">管理员</Tag> : <Tag color="blue">游客</Tag>}
            </div>
            <div className={style.time}>{moment(publishAt).format('YYYY-MM-DD HH:mm:ss')}</div>
          </div>
          <div className={style.rightFuncBox}>
            {user && user.role === 'admin' ? (
              <div className={`${style.delComment} iconfont`} onClick={handleDel}>
                &#xe604;
              </div>
            ) : undefined}
            {noLikes ? undefined : (
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
                <span className={`${style.likesNum}`}>{likes}</span>
              </div>
            )}
          </div>
        </div>
        <div className={style.signature}>{brief}</div>
      </div>
      <div className={style.comment}>{contents}</div>
    </div>
  );
};

export default SingleComment;
