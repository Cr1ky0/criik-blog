import React, { useState } from 'react';

// css
import style from './index.module.scss';

// ui
import ChangeFormBox from '@/components/UI/ChangeFormBox';

const ChangeInfo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const openForm = (state: boolean) => {
    setIsOpen(state);
    const div = document.getElementById('change-form-box-anime') as HTMLElement;
    // 如果打开就设置为scrollHeight否则为0
    if (state) div.style.height = div.scrollHeight + 'px';
    else div.style.height = '0';
  };
  return (
    <div className={style.wrapper}>
      <div className={style.accountSecurity}>
        <div className={style.title}>
          <div></div>
          <div>账户与安全</div>
        </div>
        <ChangeFormBox title="密码" placeHolder="********" isOpen={isOpen} handleClick={openForm}>
          <div>
            <input type="password" />
            <div></div>
          </div>
          <div>
            <input type="password" />
            <div></div>
          </div>
        </ChangeFormBox>
        {/*<div className={style.form}></div>*/}
      </div>
    </div>
  );
};

export default ChangeInfo;
