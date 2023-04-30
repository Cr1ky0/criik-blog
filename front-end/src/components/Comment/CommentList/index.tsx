import React, { useState } from 'react';

// antd
import type { MenuProps } from 'antd';
import { Menu, Skeleton, Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments, setCurPage, setIsLoading } from '@/redux/slices/comments';

const items: MenuProps['items'] = [
  {
    label: '按时间',
    key: 'time',
    // icon: <MailOutlined />,
  },
  {
    label: '按热度',
    key: 'hot',
    // icon: <AppstoreOutlined />,
  },
];

const CommentList = () => {
  const [current, setCurrent] = useState('time');
  const comments = useAppSelector(state => state.comments.commentList);
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curPage = useAppSelector(state => state.comments.curPage);
  const isLoading = useAppSelector(state => state.comments.isLoading);
  const length = useAppSelector(state => state.comments.length);
  const dispatch = useAppDispatch();
  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
  };

  return (
    <>
      {/* 加载状态 */}
      {isLoading ? (
        <div style={{ marginTop: '5vh' }}>
          <Skeleton active />
        </div>
      ) : (
        <div className={`${style.wrapper} clearfix`}>
          <div className={`${style.statistics} clearfix`}>
            <div className={style.counts}>{length} 评论</div>
            <Menu
              onClick={onClick}
              selectedKeys={[current]}
              mode="horizontal"
              items={items}
              className={style.sortMenu}
              disabledOverflow
              onSelect={() => {
                if (current === 'time') {
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
                    sort: current === 'time' ? '-publishAt' : '-likes',
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
