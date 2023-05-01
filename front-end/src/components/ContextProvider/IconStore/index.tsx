import React, { createContext, useContext, useState } from 'react';

// interface
import { AntdIcon } from '@/interface';

interface IconStoreProps {
  children: React.ReactNode;
}

// antd icons
import {
  HomeFilled,
  CodeFilled,
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
  const [iconList, setIconList] = useState([
    { name: 'Home', icon: <HomeFilled /> },
    { name: 'Code', icon: <CodeFilled /> },
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
  ]);
  return <iconStoreContext.Provider value={iconList}>{children}</iconStoreContext.Provider>;
};
export default IconStore;

export const useIcons = () => {
  return useContext(iconStoreContext);
};
