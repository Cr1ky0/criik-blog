import React, { createContext, useContext, useState } from 'react';

// interface
import { AntdIcon } from '@/interface';

interface IconStoreProps {
  children: React.ReactNode;
}

// antd icons
import {
  HomeOutlined,
  CodeOutlined,
  BookOutlined,
  CalculatorOutlined,
  CoffeeOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  FunctionOutlined,
  HddOutlined,
  InboxOutlined,
  LinkOutlined,
  SettingOutlined,
  StarOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons';

const iconStoreContext = createContext<AntdIcon[]>([]);
const IconStore: React.FC<IconStoreProps> = props => {
  const { children } = props;
  const [iconList, setIconList] = useState([
    { name: 'home', icon: <HomeOutlined /> },
    { name: 'code', icon: <CodeOutlined /> },
    { name: 'book', icon: <BookOutlined /> },
    { name: 'calculator', icon: <CalculatorOutlined /> },
    { name: 'coffee', icon: <CoffeeOutlined /> },
    { name: 'folder', icon: <FolderOutlined /> },
    { name: 'folderOpen', icon: <FolderOpenOutlined /> },
    { name: 'function', icon: <FunctionOutlined /> },
    { name: 'hdd', icon: <HddOutlined /> },
    { name: 'inbox', icon: <InboxOutlined /> },
    { name: 'link', icon: <LinkOutlined /> },
    { name: 'setting', icon: <SettingOutlined /> },
    { name: 'star', icon: <StarOutlined /> },
    { name: 'tag', icon: <TagOutlined /> },
    { name: 'tags', icon: <TagsOutlined /> },
  ]);
  return <iconStoreContext.Provider value={iconList}>{children}</iconStoreContext.Provider>;
};
export default IconStore;

export const useIcons = () => {
  return useContext(iconStoreContext);
};
