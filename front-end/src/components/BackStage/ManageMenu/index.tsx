import React from 'react';
import { useNavigate } from 'react-router';

// antd
import {
  EditOutlined,
  CommentOutlined,
  BookOutlined,
  CloudDownloadOutlined,
  MailOutlined,
  PlusSquareOutlined,
  PictureOutlined,
  StarOutlined,
  PushpinOutlined,
  FieldTimeOutlined,
  MenuOutlined,
  FolderOutlined,
} from '@ant-design/icons';
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
  getItem('博客管理', 'blog', <BookOutlined />),
  getItem('菜单管理', 'editmenu', <MenuOutlined />),
  getItem('添加照片', 'photo', <PlusSquareOutlined />),
  getItem('编辑照片', 'editPhoto', <PictureOutlined />, [
    getItem('即时上传', 'now', <PushpinOutlined />),
    getItem('大事记', 'bigEvent', <StarOutlined />),
    getItem('往事回忆', 'memory', <FieldTimeOutlined />),
    getItem('其他', 'others', <FolderOutlined />),
  ]),
  getItem('OSS设置', 'oss', <CloudDownloadOutlined />),
  getItem('SMTP设置', 'smtp', <MailOutlined />),
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
        if (['now', 'bigEvent', 'memory', 'others'].includes(e.key)) navigate(`/backstage/editPhoto`, { state: e.key });
        else navigate(`/backstage/${e.key}`);
      }}
    />
  );
};

export default ManageMenu;
