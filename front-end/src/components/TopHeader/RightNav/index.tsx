import React from 'react';

// css
import './index.scss';

// antd
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// ui-c
import LinkBtn2 from '../../UI/LinkBtn2';

const RightNav = () => {
  return (
    <div className="rightNav">
      <LinkBtn2 text={'注册'}></LinkBtn2>
      <LinkBtn2 text={'登录'}></LinkBtn2>
      <Avatar className="avator-box" icon={<UserOutlined />} />
    </div>
  );
};

export default RightNav;
