import React, { CSSProperties, useEffect, useState } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// util
import { getClassificationInfo, getLimitString } from '@/utils';

// comp
import LinkIcon from './LinkIcon';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';

// api
import { avatarAjax, getMyInfo } from '@/api/user';
import { UserObj } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setTimeLine } from '@/redux/slices/blog';

// interface
export interface IntroductionBoxProps {
  isMobile?: boolean;
  styles?: CSSProperties;
}

const IntroductionBox: React.FC<IntroductionBoxProps> = props => {
  const { isMobile, styles } = props;
  const message = useGlobalMessage();
  const blogsNum = useAppSelector(state => state.blog.blogsNum);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const [user, setUser] = useState({} as UserObj);
  const [avatar, setAvatar] = useState(useAvatar());
  // cookie
  const cookies = new Cookies();
  const curUser = cookies.get('user');
  // 用户登录后的头像
  const userAvatar = useAvatar();
  const limit = 40;
  useEffect(() => {
    dispatch(setTimeLine());
  }, []);
  useEffect(() => {
    if (!curUser) {
      // 没有登录用户就请求我的个人信息
      const getInfo = async () => {
        const res = await getMyInfo();
        const user = res.data.user;
        delete user['_id'];
        setUser(user);
        await avatarAjax(user.avatar, response => {
          const reader = new FileReader();
          reader.onload = e => {
            if (e.target) setAvatar(e.target.result as string);
          };
          reader.readAsDataURL(response);
        });
      };
      getInfo().catch(err => {
        message.error(err.message);
      });
    } else {
      setUser(curUser);
    }
  }, []);
  return (
    <div
      className={`${style.wrapper} ${themeMode === 'dark' ? 'dark-2' : 'light'}`}
      style={isMobile ? Object.assign({ boxShadow: 'none' }, styles) : styles}
    >
      <div className={`${style.intro} clearfix`}>
        <div className={style.avatar} style={{ backgroundImage: `url(${curUser ? userAvatar : avatar})` }}></div>
        <div className={style.username}>{user.name ? user.name : undefined}</div>
        <div className={style.signature}>{user.brief ? getLimitString(limit, user.brief) : undefined}</div>
      </div>
      <div className={style.blogInfo}>
        <div>
          <div>{getClassificationInfo(menus).length}</div>
          <div>分类</div>
        </div>
        <div>
          <div>{blogsNum}</div>
          <div>文章</div>
        </div>
      </div>
      <div className={`${style.linkBox} clearfix`}>
        <LinkIcon
          icon="&#xea0a;"
          styles={{ color: '#2c3e50' }}
          content="Github"
          href="https://github.com/Creekyu"
        ></LinkIcon>
        <LinkIcon
          icon="&#xe66a;"
          styles={{ color: '#5eaade' }}
          content="QQ"
          href="tencent://Message/?Uin=503094716&Menu=yes"
        ></LinkIcon>
        <LinkIcon
          icon="&#xe731;"
          styles={{ color: '#3397db' }}
          content="Telegram"
          href="https://t.me/Criiky0"
        ></LinkIcon>
      </div>
    </div>
  );
};

export default IntroductionBox;
