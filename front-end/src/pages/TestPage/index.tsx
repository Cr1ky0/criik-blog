import React from 'react';

// interface
import { SideMenuItem, BlogTagBoxStatistic } from '@/interface';

// comp
import { AppstoreOutlined, LinkOutlined, SettingOutlined } from '@ant-design/icons';
import SideMenu from '@/components/SideMenu';
import BlogTagBox from '@/components/HomePage/BlogTagBox';
import IntroductionBox from '@/components/HomePage/IntroductionBox';

const TestPage = () => {
  const statistics: BlogTagBoxStatistic = { author: 'criiky0', views: 200, time: '2023/4/12', classification: 'ts' };
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
      {/* <BlogTagBox title="test" statistics={statistics}>
        Test
      </BlogTagBox>
      <SideMenu menus={menuList}></SideMenu> */}
      <IntroductionBox
        username="Criiky0"
        signature="测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试v"
      ></IntroductionBox>
    </div>
  );
};

export default TestPage;
