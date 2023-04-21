import React, { useState } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// ui
import ChangeFormBox from '@/components/UI/ChangeFormBox';
import LinkBtn2 from '@/components/UI/LinkBtn2';

const ChangeInfo = () => {
  const [isOpen, setIsOpen] = useState([false, false, false, false]);
  const cookies = new Cookies();
  const user = cookies.get('user');
  const openForm = (state: boolean, chosenList: boolean[], key: number) => {
    const newList = [];
    for (let i = 0; i < chosenList.length; i += 1) {
      const div = document.getElementById('change-form-box-anime-' + i) as HTMLElement;
      if (i === key) {
        newList.push(state);
        // 如果打开就设置为scrollHeight
        if (state) div.style.height = div.scrollHeight + 'px';
        else div.style.height = '0';
      } else {
        newList.push(false);
        // 其他关闭
        div.style.height = '0';
      }
    }
    setIsOpen(newList);
  };
  return (
    <div className={style.wrapper}>
      <div className={style.accountSecurity}>
        <div className={style.title}>
          <div></div>
          <div>账户与安全</div>
        </div>
        <ChangeFormBox
          title="密码"
          placeHolder="********"
          isOpen={isOpen}
          handleClick={openForm}
          type="password"
          seq={0}
        >
          <div>
            <input type="password" placeholder="确认密码" />
            <div></div>
          </div>
        </ChangeFormBox>
        <ChangeFormBox title="邮箱" placeHolder={user.email} isOpen={isOpen} handleClick={openForm} type="text" seq={1}>
          <div>
            <input type="text" placeholder="验证码" />
            <LinkBtn2 styles={{ width: '110px' }}>获取验证码</LinkBtn2>
          </div>
        </ChangeFormBox>
      </div>
      <div className={style.selfInfo}>
        <div className={style.title}>
          <div></div>
          <div>个人信息</div>
        </div>
        <ChangeFormBox
          title="昵称"
          placeHolder={user.name}
          isOpen={isOpen}
          handleClick={openForm}
          type="text"
          seq={2}
        ></ChangeFormBox>
        <ChangeFormBox
          title="个人简介"
          placeHolder={user.brief}
          isOpen={isOpen}
          handleClick={openForm}
          type="text"
          seq={3}
        ></ChangeFormBox>
      </div>
    </div>
  );
};

export default ChangeInfo;
