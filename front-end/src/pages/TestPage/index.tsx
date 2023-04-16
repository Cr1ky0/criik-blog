import React from 'react';
import SideMenu from '@/components/SideMenu';
import { SideMenuItem } from '@/interface';

// comp
import { AppstoreOutlined, LinkOutlined, SettingOutlined } from '@ant-design/icons';

const TestPage = () => {
  // const statistcs: BlogTagBoxStatistic = { author: 'criiky0', views: 200, time: '2023/4/12', classification: 'ts' };
  const menuList: SideMenuItem[] = [
    {
      label: 'test',
      key: 'test',
      icon: <AppstoreOutlined />,
      children: [
        {
          label: 'test1',
          key: 'test1',
          icon: <LinkOutlined />,
          children: [
            { label: 'test1', key: 'test1', icon: <LinkOutlined /> },
            { label: 'test2', key: 'test2', icon: <SettingOutlined /> },
            { label: 'test3', key: 'test3', icon: <AppstoreOutlined /> },
          ],
        },
        { label: 'test2', key: 'test2', icon: <SettingOutlined /> },
        { label: 'test3', key: 'test3', icon: <AppstoreOutlined /> },
      ],
    },
    {
      label: 'test4',
      key: 'test4',
      icon: <AppstoreOutlined />,
      children: [
        { label: 'test5', key: 'test5', icon: <LinkOutlined /> },
        { label: 'test6', key: 'test6', icon: <SettingOutlined /> },
        { label: 'test7', key: 'test7', icon: <AppstoreOutlined /> },
      ],
    },
  ];

  return (
    <div style={{ margin: '20vh' }}>
      <SideMenu menus={menuList}></SideMenu>
    </div>
  );
};
export default TestPage;
