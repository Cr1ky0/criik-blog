import React from 'react';

// css
import style from './index.module.scss';

// interface
import { CommentListObj } from '@/interface';

// comp
import SingleReply from '@/components/Comment/CommentList/ReplyList/SingleReply';

// redux
import { useAppSelector } from '@/redux';

interface ReplyListProps {
  comment: CommentListObj;
  noLikes?: boolean;
}

const ReplyList: React.FC<ReplyListProps> = ({ comment, noLikes }) => {
  const themeMode = useAppSelector(state => state.universal.themeMode);
  return (
    <div
      className={`${style.wrapper} ${themeMode === 'dark' ? 'dark' : 'light'}`}
      style={comment.replys && comment.replys.length ? { paddingTop: 30 } : undefined}
    >
      {comment.replys
        ? comment.replys.map(reply => {
            return <SingleReply key={reply._id} reply={reply} noLikes={noLikes}></SingleReply>;
          })
        : undefined}
    </div>
  );
};

export default ReplyList;
