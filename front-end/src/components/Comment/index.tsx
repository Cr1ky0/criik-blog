import React, { useEffect } from 'react';

// css
import style from './index.module.scss';

// comp
import WriteComment from './WriteComment';
import CommentList from './CommentList';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments, setCurPage, setLength } from '@/redux/slices/comments';

const Comment = () => {
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setComments({ id: selectedId, page: 1 }));
    dispatch(setCurPage(1));
    dispatch(setLength(selectedId));
  }, [selectedId]);

  return (
    <div className={style.wrapper}>
      <WriteComment></WriteComment>
      <CommentList></CommentList>
    </div>
  );
};

export default Comment;
