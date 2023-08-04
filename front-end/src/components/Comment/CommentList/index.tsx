import React from 'react';

// antd
import type { MenuProps } from 'antd';
import { Menu, Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';
import LoadingComp from '@/components/Universal/LoadingComp';
import ReplyList from '@/components/Comment/CommentList/ReplyList';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments, setCurPage, setIsLoading, setSort } from '@/redux/slices/comments';

const items: MenuProps['items'] = [
  {
    label: '按时间',
    key: 'time',
  },
  {
    label: '按热度',
    key: 'hot',
  },
];

const CommentList = () => {
  const sort = useAppSelector(state => state.comments.sort);
  const comments = useAppSelector(state => state.comments.commentList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curPage = useAppSelector(state => state.comments.curPage);
  const isLoading = useAppSelector(state => state.comments.isLoading);
  const length = useAppSelector(state => state.comments.length);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const onClick: MenuProps['onClick'] = e => {
    dispatch(setSort(e.key));
  };

  const onSelect = (e: any) => {
    dispatch(setSort(e.key));
    if (e.key === 'time') {
      dispatch(setIsLoading(true));
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 800);
      dispatch(
        setComments({
          id: selectedId,
          page: curPage,
          sort: '-publishAt',
        })
      );
    } else {
      dispatch(setIsLoading(true));
      setTimeout(() => {
        dispatch(setIsLoading(false));
      }, 800);
      dispatch(
        setComments({
          id: selectedId,
          page: curPage,
          sort: '-likes',
        })
      );
    }
  };

  const onChange = (page: number) => {
    dispatch(setIsLoading(true));
    setTimeout(() => {
      dispatch(setIsLoading(false));
    }, 500);
    dispatch(setCurPage(page));
    dispatch(
      setComments({
        id: selectedId,
        page,
        sort: sort === 'time' ? '-publishAt' : '-likes',
      })
    );
  };

  return (
    <>
      {/* 加载状态 */}
      {isLoading ? (
        <LoadingComp styles={{ marginTop: '5vh' }}></LoadingComp>
      ) : (
        <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
          <div className={`${style.statistics} clearfix`}>
            <div className={style.counts}>{length} 评论</div>
            <Menu
              onClick={onClick}
              selectedKeys={[sort]}
              mode="horizontal"
              items={items}
              className={style.sortMenu}
              disabledOverflow
              onSelect={onSelect}
            />
          </div>
          <div className={style.comments}>
            {comments.length
              ? comments.map(comment => {
                  return (
                    <div key={comment.id}>
                      <SingleComment info={comment} />
                      <ReplyList comment={comment}></ReplyList>
                    </div>
                  );
                })
              : undefined}
          </div>
          <div className={style.paginate}>
            <Pagination current={curPage} defaultPageSize={5} total={length} onChange={onChange} />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentList;
