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
    { name: 'Hdd', icon: <HddFilled /> },
    { name: 'CheckCircle', icon: <CheckCircleFilled /> },
    { name: 'CloseCircle', icon: <CloseCircleFilled /> },
    { name: 'Windows', icon: <WindowsFilled /> },
    { name: 'Apple', icon: <AppleFilled /> },
    { name: 'Github', icon: <GithubFilled /> },
    {
      name: '前端',
      icon: (
        <span className="iconfont" style={{ fontSize: '16px' }}>
          &#xe625;
        </span>
      ),
    },
    {
      name: 'Javascript',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe6f7;
        </span>
      ),
    },
    {
      name: 'Typescript',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xecef;
        </span>
      ),
    },
    {
      name: 'HTML5',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe602;
        </span>
      ),
    },
    {
      name: 'CSS3',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe6a8;
        </span>
      ),
    },
    {
      name: 'Nodejs',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe989;
        </span>
      ),
    },
    {
      name: 'Git',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe61b;
        </span>
      ),
    },
    {
      name: 'React',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xec77;
        </span>
      ),
    },
    {
      name: 'Vue',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe69a;
        </span>
      ),
    },
    {
      name: 'Webpack',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xed0b;
        </span>
      ),
    },
    {
      name: 'MongoDB',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#xe63f;
        </span>
      ),
    },
    {
      name: '数组',
      icon: (
        <span className="iconfont" style={{ fontSize: '18px' }}>
          &#x11ce7;
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
