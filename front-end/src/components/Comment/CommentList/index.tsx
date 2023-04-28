import React, { useEffect, useState } from 'react';

// antd
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

// css
import style from './index.module.scss';

// comp
import SingleComment from '@/components/Comment/CommentList/SingleComment';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setComments } from '@/redux/slices/comments';

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
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const dispatch = useAppDispatch();
  const comments = useAppSelector(state => state.comments.commentList);
  console.log(comments);
  useEffect(() => {
    dispatch(setComments(selectedId));
  }, []);
  const onClick: MenuProps['onClick'] = e => {
    setCurrent(e.key);
  };

  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={`${style.statistics} clearfix`}>
        <div className={style.counts}>1000 评论</div>
        <Menu
          onClick={onClick}
          selectedKeys={[current]}
          mode="horizontal"
          items={items}
          className={style.sortMenu}
          disabledOverflow
        />
      </div>
      <ul className={style.comments}>
        {comments.length
          ? comments.map(comment => {
              const { id, username, brief, time, likes, contents } = comment;
              return <SingleComment key={id} info={{ id, username, brief, time, likes, contents }} />;
            })
          : undefined}
      </ul>
    </div>
  );
};

export default CommentList;
