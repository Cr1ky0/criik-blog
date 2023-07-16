import React from 'react';
import { useNavigate } from 'react-router';

// antd
import { EditOutlined, CommentOutlined, UnorderedListOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

// redux
import { useAppSelector } from '@/redux';

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  getItem('个人信息', 'info', <EditOutlined />),
  getItem('评论管理', 'comment', <CommentOutlined />),
  getItem('博客管理', 'blog', <UnorderedListOutlined />),
];

const ManageMenu = () => {
  const navigate = useNavigate();
  const selectKey = useAppSelector(state => state.backstage.selectKey);
  return (
    <Menu
      theme="light"
      selectedKeys={[selectKey]}
      mode="inline"
      items={items}
      onClick={e => {
        navigate(`/backstage/${e.key}`);
      }}
    />
  );
};

export default ManageMenu;
