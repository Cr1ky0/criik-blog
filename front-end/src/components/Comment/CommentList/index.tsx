import React, { useState } from 'react';

// css
import style from './index.module.scss';

// antd
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import SingleComment from '@/components/Comment/CommentList/SingleComment';

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
        <SingleComment>test</SingleComment>
        <SingleComment>test</SingleComment>
        <SingleComment>test</SingleComment>
      </ul>
    </div>
  );
};

export default CommentList;
