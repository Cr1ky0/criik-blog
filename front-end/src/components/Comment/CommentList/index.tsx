import React from 'react';

// antd
import type { MenuProps } from 'antd';
import { Menu, Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments, setCurPage, setIsLoading, setSort } from '@/redux/slices/comments';
import LoadingComp from '@/components/Universal/LoadingComp';

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
  const dispatch = useAppDispatch();
  const onClick: MenuProps['onClick'] = e => {
    dispatch(setSort(e.key));
  };

  return (
    <>
      {/* 加载状态 */}
      {isLoading ? (
        <LoadingComp styles={{ marginTop: '5vh' }} changeImg></LoadingComp>
      ) : (
        <div className={`${style.wrapper} clearfix`}>
          <div className={`${style.statistics} clearfix`}>
            <div className={style.counts}>{length} 评论</div>
            <Menu
              onClick={onClick}
              selectedKeys={[sort]}
              mode="horizontal"
              items={items}
              className={style.sortMenu}
              disabledOverflow
              onSelect={e => {
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
              }}
            />
          </div>
          <ul className={style.comments}>
            {comments.length
              ? comments.map(comment => {
                  return <SingleComment key={comment.id} info={comment} />;
                })
              : undefined}
          </ul>
          <div className={style.paginate}>
            <Pagination
              current={curPage}
              defaultPageSize={5}
              total={length}
              onChange={page => {
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
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CommentList;
