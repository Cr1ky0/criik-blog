import React, { useMemo, useState } from 'react';
import Cookies from 'universal-cookie';

// antd
import { Tag } from 'antd';

// css
import style from './index.module.scss';

// interface
import { commentObj } from '@/interface';
import { avatarAjax, getAvatarOfUser } from '@/api/user';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalModal } from '@/components/ContextProvider/ModalProvider';

// img
import img from '@/assets/images/default.png';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeId, delLikeId, updateComment, deleteComment, decLength } from '@/redux/slices/comments';

// util
import { isLike } from '@/utils';

//api
import { updateCommentAjax, deleteCommentAjax } from '@/api/comment';

export interface SingleCommentProps {
  info: commentObj;
}

const SingleComment: React.FC<SingleCommentProps> = props => {
  const { info } = props;
  const modal = useGlobalModal();
  const message = useGlobalMessage();
  const { contents, username, brief, time, userId, likes, id, userRole } = info;
  // 利用likeList判断当前评论的id是否在其中来记录点赞状态
  const likeList = useAppSelector(state => state.comments.likeList);
  const isChosen = isLike(likeList, id);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState(img);
  const cookies = new Cookies();
  const user = cookies.get('user');
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
  const handleClick = async () => {
    if (!isChosen) {
      dispatch(addLikeId(id));
      await updateCommentAjax(
        { id, likes: likes + 1 },
        data => {
          const updatedComment = data.data.updatedComment;
          dispatch(updateComment({ id, data: { likes: updatedComment.likes } }));
        },
        msg => {
          message.error(msg);
        }
      );
    } else {
      dispatch(delLikeId(id));
      await updateCommentAjax(
        { id, likes: likes - 1 },
        data => {
          const updatedComment = data.data.updatedComment;
          dispatch(updateComment({ id, data: { likes: updatedComment.likes } }));
        },
        msg => {
          message.error(msg);
        }
      );
    }
  };

  return (
    <li className={`${style.wrapper} clearfix`}>
      <div className={`${style.infoWrapper} clearfix`}>
        <div className={style.avatar} style={{ backgroundImage: `url(${avatar})` }}></div>
        <div className={style.info}>
          <div className={style.infoBox}>
            <div className={style.username}>{username}</div>
            <div className={style.tags}>
              {userRole === 'admin' ? <Tag color="red">管理员</Tag> : <Tag color="blue">游客</Tag>}
            </div>
            <div className={style.time}>{time}</div>
          </div>
          <div className={style.rightFuncBox}>
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
            {user && user.role === 'admin' ? (
              <div
                className={`${style.delComment} iconfont`}
                onClick={() => {
                  modal.confirm({
                    title: '提示',
                    content: '是否删除该评论？',
                    onOk: async () => {
                      await deleteCommentAjax(
                        id,
                        () => {
                          message.success('删除成功');
                        },
                        msg => {
                          message.error(msg);
                        }
                      );
                      dispatch(deleteComment(id));
                      dispatch(decLength());
                    },
                  });
                }}
              >
                &#xe604;
              </div>
            ) : undefined}
          </div>
        </div>
        <div className={style.signature}>{brief}</div>
      </div>
      <div className={style.comment}>{contents}</div>
    </li>
  );
};

export default SingleComment;
