import React, { RefObject, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// comp
import ChangeFormBox from '@/components/TopHeader/ChangeInfo/ChangeFormBox';

// ui
import LinkBtn2 from '@/components/UI/LinkBtn2';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// api
import { sendCodeAjax, updateEmailAjax, updateMeAjax, updateMyPswAjax } from '@/api/user';

const ChangeInfo = () => {
  const [isOpen, setIsOpen] = useState([false, false, false, false]);
  const cookies = new Cookies();
  const user = cookies.get('user');
  const message = useGlobalMessage();
  const navigate = useNavigate();
  // ref
  // psw Ref
  const oldPswRef = useRef<HTMLInputElement>(null);
  const pswRef = useRef<HTMLInputElement>(null);
  const pswCfmRef2 = useRef<HTMLInputElement>(null);
  // email Ref
  const newEmailRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  // info Ref
  const usernameRef = useRef<HTMLInputElement>(null);
  const briefRef = useRef<HTMLInputElement>(null);
  // 实现展开Form动画
  const openForm = useCallback((state: boolean, chosenList: boolean[], key: number) => {
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
  }, []);
  // 获取表单内数据
  const getFormValues = useCallback(
    (
      mainRef: RefObject<HTMLInputElement>,
      otherRef?: RefObject<HTMLInputElement>,
      otherRef2?: RefObject<HTMLInputElement>
    ) => {
      const main = mainRef.current as HTMLInputElement;
      let other;
      let other2;
      if (otherRef) other = otherRef.current as HTMLInputElement;
      if (otherRef2) other2 = otherRef2.current as HTMLInputElement;
      return Object.assign(
        { [main.name]: main.value },
        other ? { [other.name]: other.value } : undefined,
        other2 ? { [other2.name]: other2.value } : undefined
      );
    },
    []
  );
  // 密码表单
  const handlePasswordForm = useCallback(async () => {
    const data = getFormValues(oldPswRef, pswRef, pswCfmRef2);
    await updateMyPswAjax(data);
    await message.success('修改成功，请重新登录！');
    cookies.remove('token');
    cookies.remove('user');
    navigate(0);
  }, []);

  // 邮箱表单
  const sendCode = useCallback(async () => {
    await sendCodeAjax();
    await message.success('验证码已发送到原邮箱，请前往邮箱查看！');
  }, []);
  const handleEmailForm = useCallback(async () => {
    const data = getFormValues(newEmailRef, codeRef);
    await updateEmailAjax(data);
    await message.success('链接已发送至新邮箱，请前往验证');
  }, []);
  // 个人信息表单
  const handleUsernameForm = useCallback(async () => {
    const data = getFormValues(usernameRef);
    await updateMeAjax(data);
    await message.success('更新成功!');
    // TODO:更新状态
    navigate(0);
  }, []);
  const handleBriefForm = useCallback(async () => {
    const data = getFormValues(briefRef);
    await updateMeAjax(data);
    await message.success('更新成功!');
    navigate(0);
  }, []);
  return (
    <div className={style.wrapper}>
      <div className={style.accountSecurity}>
        <div className={style.title}>
          <div></div>
          <div>账户与安全</div>
        </div>
        <ChangeFormBox
          name="oldPassword"
          title="密码"
          placeHolder="********"
          isOpen={isOpen}
          handleClose={openForm}
          handleSubmit={handlePasswordForm}
          type="password"
          seq={0}
          ref={oldPswRef}
        >
          <div>
            <input type="password" placeholder="新密码" name="password" ref={pswRef} />
          </div>
          <div>
            <input type="password" placeholder="确认密码" name="passwordConfirm" ref={pswCfmRef2} />
          </div>
        </ChangeFormBox>
        <ChangeFormBox
          title="邮箱"
          placeHolder={user.email}
          isOpen={isOpen}
          handleClose={openForm}
          handleSubmit={handleEmailForm}
          type="text"
          seq={1}
          name="newEmail"
          ref={newEmailRef}
        >
          <div>
            <input type="text" placeholder="验证码" name="code" ref={codeRef} />
            <LinkBtn2 styles={{ width: '110px' }} onClick={sendCode}>
              获取验证码
            </LinkBtn2>
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
          handleClose={openForm}
          ref={usernameRef}
          handleSubmit={handleUsernameForm}
          type="text"
          name="name"
          seq={2}
        ></ChangeFormBox>
        <ChangeFormBox
          title="个人简介"
          placeHolder={user.brief}
          isOpen={isOpen}
          handleClose={openForm}
          handleSubmit={handleBriefForm}
          ref={briefRef}
          type="text"
          name="brief"
          seq={3}
        ></ChangeFormBox>
      </div>
    </div>
  );
};
export default ChangeInfo;
