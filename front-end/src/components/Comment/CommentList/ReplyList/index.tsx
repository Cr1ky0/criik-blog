import React from 'react';

// css
import style from './index.module.scss';

// interface
import { CommentListObj } from '@/interface';

// comp
import SingleReply from '@/components/Comment/CommentList/ReplyList/SingleReply';

interface ReplyListProps {
  comment: CommentListObj;
  noLikes?: boolean;
}

const ReplyList: React.FC<ReplyListProps> = ({ comment, noLikes }) => {
  return (
    <div className={style.wrapper} style={comment.replys.length ? { paddingTop: 30 } : undefined}>
      {comment.replys.map(reply => {
        return <SingleReply key={reply._id} reply={reply} noLikes={noLikes}></SingleReply>;
      })}
    </div>
  );
};

export default ReplyList;
