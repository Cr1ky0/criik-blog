import React, { useCallback, useState } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// comp
import Information from '@/components/TopHeader/Information';

// antd
import { Dropdown, Drawer } from 'antd';
import type { MenuProps } from 'antd';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { BREAK_POINT } from '@/global';

const Avatar = () => {
  const [openInfomation, setOpenInfomation] = useState(false);
  const message = useGlobalMessage();
  const navigate = useNavigate();
  const avatar = useAvatar();
  const { width } = useViewport();
  const cookies = new Cookies();
  const user = cookies.get('user');

  const onCloseInfo = useCallback(() => {
    setOpenInfomation(false);
  }, []);
  const items: MenuProps['items'] = [
    {
      label: (
        <div
          style={{ padding: '5px 10px' }}
          onClick={() => {
            setOpenInfomation(!openInfomation);
          }}
        >
          个人信息
        </div>
      ),
      key: '0',
    },
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
  ];
  return (
    <>
      {user ? (
        <>
          <Dropdown menu={{ items }} trigger={['click']}>
            <div className={style.rightNavAvatar} style={{ backgroundImage: `url(${avatar})` }}></div>
          </Dropdown>
          <Drawer
            title="Personal Information"
            style={{ border: 'none' }}
            width={width > BREAK_POINT ? '400px' : '100vw'}
            placement={width > BREAK_POINT ? 'right' : 'left'}
            onClose={onCloseInfo}
            open={openInfomation}
            destroyOnClose
          >
            <Information></Information>
          </Drawer>
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
