import React, { createContext, useContext } from 'react';

// interface
import { AntdIcon } from '@/interface';

interface IconStoreProps {
  children: React.ReactNode;
}

// antd icons
import { HomeOutlined, CodeOutlined } from '@ant-design/icons';

const iconStoreContext = createContext<AntdIcon[]>([
  { name: 'home', icon: <HomeOutlined /> },
  { name: 'code', icon: <CodeOutlined /> },
]);
const IconStore: React.FC<IconStoreProps> = props => {
  const { children } = props;
  const iconList = useContext(iconStoreContext);
  return <iconStoreContext.Provider value={iconList}>{children}</iconStoreContext.Provider>;
};
export default IconStore;

export const useIcons = () => {
  return useContext(iconStoreContext);
};
