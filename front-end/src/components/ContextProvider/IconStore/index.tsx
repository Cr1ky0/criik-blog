import React, { createContext, useContext, useState } from 'react';

// interface
import { AntdIcon } from '@/interface';

interface IconStoreProps {
  children: React.ReactNode;
}

// antd icons
import {
  HomeFilled,
  BookFilled,
  CalculatorFilled,
  FolderFilled,
  FolderOpenFilled,
  FunctionOutlined,
  HddFilled,
  SettingFilled,
  StarFilled,
  TagFilled,
  TagsFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  EditFilled,
  WindowsFilled,
  AppleFilled,
  GithubFilled,
  AppstoreFilled,
  CloudFilled,
  HeartFilled,
  LockFilled,
  PictureFilled,
  PushpinFilled,
  SignalFilled,
} from '@ant-design/icons';

const iconStoreContext = createContext<AntdIcon[]>([]);
const IconStore: React.FC<IconStoreProps> = props => {
  const { children } = props;
  const [iconList] = useState([
    { name: 'Home', icon: <HomeFilled /> },
    {
      name: 'Code',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe7fc;
        </span>
      ),
    },
    { name: 'Book', icon: <BookFilled /> },
    { name: 'Setting', icon: <SettingFilled /> },
    { name: 'Appstore', icon: <AppstoreFilled /> },
    { name: 'Heart', icon: <HeartFilled /> },
    { name: 'Lock', icon: <LockFilled /> },
    { name: 'Star', icon: <StarFilled /> },
    { name: 'Folder', icon: <FolderFilled /> },
    { name: 'FolderOpen', icon: <FolderOpenFilled /> },
    { name: 'Tag', icon: <TagFilled /> },
    { name: 'Tags', icon: <TagsFilled /> },
    { name: 'Edit', icon: <EditFilled /> },
    { name: 'Cloud', icon: <CloudFilled /> },
    { name: 'Pushpin', icon: <PushpinFilled /> },
    { name: 'Calculator', icon: <CalculatorFilled /> },
    { name: 'Picture', icon: <PictureFilled /> },
    { name: 'Signal', icon: <SignalFilled /> },
    { name: 'Function', icon: <FunctionOutlined /> },
    { name: 'CheckCircle', icon: <CheckCircleFilled /> },
    { name: 'CloseCircle', icon: <CloseCircleFilled /> },
    { name: 'Windows', icon: <WindowsFilled /> },
    { name: 'Apple', icon: <AppleFilled /> },
    { name: 'Hdd', icon: <HddFilled /> },
    { name: 'Github', icon: <GithubFilled /> },
    {
      name: '前端',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xe625;
        </span>
      ),
    },
    {
      name: '前端2',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xeac1;
        </span>
      ),
    },
    {
      name: 'Server',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xf0ac;
        </span>
      ),
    },
    {
      name: 'Java',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe6e0;
        </span>
      ),
    },
    {
      name: 'Javascript',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xe6f7;
        </span>
      ),
    },
    {
      name: 'Typescript',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xecef;
        </span>
      ),
    },
    {
      name: 'HTML5',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xe602;
        </span>
      ),
    },
    {
      name: 'CSS3',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xe6a8;
        </span>
      ),
    },
    {
      name: 'Nodejs',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe989;
        </span>
      ),
    },
    {
      name: 'Git',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe61b;
        </span>
      ),
    },
    {
      name: 'React',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xec77;
        </span>
      ),
    },
    {
      name: 'Vue',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe69a;
        </span>
      ),
    },
    {
      name: 'Webpack',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xed0b;
        </span>
      ),
    },
    {
      name: 'MongoDB',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe63f;
        </span>
      ),
    },
    {
      name: '数组',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#x11ce7;
        </span>
      ),
    },
    {
      name: '字符串',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe6bd;
        </span>
      ),
    },
    {
      name: 'ML',
      icon: (
        <span className="iconfont" style={{ fontSize: '14px' }}>
          &#xe65f;
        </span>
      ),
    },
    {
      name: '电脑',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe61e;
        </span>
      ),
    },
    {
      name: '计算机网络',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe62e;
        </span>
      ),
    },
    {
      name: '操作系统',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe687;
        </span>
      ),
    },
    {
      name: '数据结构',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xeac2;
        </span>
      ),
    },
  ]);
  return <iconStoreContext.Provider value={iconList}>{children}</iconStoreContext.Provider>;
};
export default IconStore;

export const useIcons = () => {
  return useContext(iconStoreContext);
};
