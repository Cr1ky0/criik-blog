import React from 'react';

// css
import './index.scss';

// antd
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// ui-c
import LinkBtn2 from '@/components/UI/LinkBtn2';

const RightNav = () => {
  return (
    <div className="right-nav">
      <LinkBtn2>Sing up</LinkBtn2>
      <LinkBtn2>Sign in</LinkBtn2>
      <Avatar className="avator-box" icon={<UserOutlined />} />
    </div>
  );
};

export default RightNav;
