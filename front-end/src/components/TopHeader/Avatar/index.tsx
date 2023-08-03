import React, { useCallback, useState } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// antd
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const Avatar = () => {
  const message = useGlobalMessage();
  const navigate = useNavigate();
  const avatar = useAvatar();
  const cookies = new Cookies();
  const user = cookies.get('user');

  const items: MenuProps['items'] = [
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/info');
          }}
        >
          修改信息
        </div>
      ),
      key: '1',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/comment');
          }}
        >
          评论管理
        </div>
      ),
      key: '2',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/blog');
          }}
        >
          博客管理
        </div>
      ),
      key: '3',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/editmenu');
          }}
        >
          菜单管理
        </div>
      ),
      key: '4',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/photo');
          }}
        >
          添加照片
        </div>
      ),
      key: '5',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/editPhoto', { state: 'now' });
          }}
        >
          编辑照片
        </div>
      ),
      key: '6',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/oss');
          }}
        >
          OSS管理
        </div>
      ),
      key: '7',
    },
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            navigate('/backstage/smtp');
          }}
        >
          SMTP管理
        </div>
      ),
      key: '8',
    },
  ];
  return (
    <>
      {user ? (
        <>
          <Dropdown menu={{ items }} trigger={['click']}>
            <div className={style.rightNavAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
          </Dropdown>
        </>
      ) : (
        <div
          className={style.rightNavAvatar}
          style={{ backgroundImage: `url(${avatar})` }}
          onClick={() => {
            message.error('请先登录！');
          }}
        ></div>
      )}
    </>
  );
};

export default Avatar;
