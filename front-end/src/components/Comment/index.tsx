import React, { useEffect } from 'react';

// css
import style from './index.module.scss';

// comp
import WriteComment from './WriteComment';
import CommentList from './CommentList';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments } from '@/redux/slices/comments';

const Comment = () => {
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setComments(selectedId));
  }, []);
  return (
    <div className={style.wrapper}>
      <WriteComment></WriteComment>
      <CommentList></CommentList>
    </div>
  );
};

export default Comment;
