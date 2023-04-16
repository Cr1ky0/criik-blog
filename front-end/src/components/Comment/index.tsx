import React from 'react';

// css
import style from './index.module.scss';

// comp
import WriteComment from './WriteComment';
import CommentList from './CommentList';

const Comment = () => {
  return (
    <div className={style.wrapper}>
      <WriteComment></WriteComment>

      <CommentList></CommentList>
    </div>
  );
};

export default Comment;
