import React, { useEffect } from 'react';

// interface
import { SideMenuItem, BlogTagBoxStatistic } from '@/interface';

// comp
import { AppstoreOutlined, LinkOutlined, SettingOutlined } from '@ant-design/icons';
import SideMenu from '@/components/SideMenu';
import BlogTagBox from '@/components/HomePage/BlogTagBox';
import IntroductionBox from '@/components/HomePage/IntroductionBox';
import Comment from '@/components/Comment';
import { useAppDispatch, useAppSelector } from '@/redux';
import ReactDOM from 'react-dom/client';
import UploadAvatar from '@/components/TopHeader/UploadAvatar';
import ReactMarkdown from '@/components/ReactMarkdownWrapper';
import Demo from '@/pages/MainPage/TestPage/test';
// hooks
import { useIcons } from '@/components/ContextProvider/IconStore';

// utils
import { getAntdIcon } from '@/utils';
import { useGlobalNotice } from '@/components/ContextProvider/NoticeProvider';
import EditMenu from '@/components/SideMenu/EditMenu';
import { setMenuList } from '@/redux/slices/blogMenu';

const TestPage = () => {
  const icons = useIcons();
  const statistics: BlogTagBoxStatistic = { author: 'criiky0', views: 200, time: '2023/4/12', classification: 'ts' };

  const openNotice = useGlobalNotice();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setMenuList());
  }, []);
  return (
    <div style={{ margin: '20vh', width: '500px' }}>
      {/*<Demo></Demo>*/}
      {/*<div>*/}
      {/*<ReactMarkdown>{markdown}</ReactMarkdown>*/}
      {/*<UploadAvatar></UploadAvatar>*/}
      {/*<App></App>*/}
      {/*{getAntdIcon('home', icons)}*/}
      {/*{getAntdIcon('code', icons)}*/}
      {/*<Comment></Comment>*/}
      {/* <BlogTagBox title="test" statistics={statistics}>
        Test
      </BlogTagBox>*/}
      <SideMenu></SideMenu>
      {/*<AddMenu></AddMenu>*/}

      {/*<IntroductionBox*/}
      {/*  username="Criiky0"*/}
      {/*  signature="测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试v"*/}
      {/*></IntroductionBox>*/}
    </div>
  );
};

export default TestPage;
