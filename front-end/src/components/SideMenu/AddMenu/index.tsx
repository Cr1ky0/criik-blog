import React from 'react';

// antd
import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';

// redux
import { useAppSelector } from '@/redux';

// utils
import { getDataNodeTree } from '@/utils';

// context
import { useIcons } from '@/components/ContextProvider/IconStore';

const AddMenu = () => {
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const icons = useIcons();
  const antdMenus = getDataNodeTree(menus, icons);

  return <Tree showLine showIcon switcherIcon={<DownOutlined />} treeData={antdMenus} />;
};

export default AddMenu;
