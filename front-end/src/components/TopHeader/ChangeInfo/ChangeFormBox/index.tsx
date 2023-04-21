import React, { CSSProperties, useState, forwardRef, RefObject } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button } from 'antd';

// global
import { THEME_COLOR } from '@/global';
import { updateMyPswAjax } from '@/api/user';

// interface
import { userInfoObj } from '@/interface';

interface ChangeFormBoxProps {
  placeHolder?: string;
  title?: string;
  isOpen: boolean[];
  children?: React.ReactNode;
  handleClose: (state: boolean, chosenList: boolean[], key: number) => void;
  handleSubmit: () => void;
  type: string;
  seq: number;
  name: string;
}

// children必须是按照制定规范的块
const ChangeFormBox = forwardRef<HTMLInputElement, ChangeFormBoxProps>((props, ref) => {
  const { placeHolder, title, isOpen, children, handleClose, handleSubmit, type, seq, name } = props;
  const [isFocus, setIsFocus] = useState(false);
  const styles: CSSProperties = { color: THEME_COLOR, borderColor: THEME_COLOR };
  return (
    <div
      className={style.wrapper}
      style={{ border: isOpen[seq] ? '1px solid rgba(0,0,0,.2)' : '1px solid transparent' }}
    >
      <div className={style.title}>{title}</div>
      <div className={style.form}>
        <div
          className={style.mainInput}
          onClick={() => {
            handleClose(true, isOpen, seq);
          }}
        >
          <input
            type={type}
            name={name}
            ref={ref}
            onFocus={event => {
              setIsFocus(true);
              if (type === 'password') event.currentTarget.placeholder = '当前密码';
            }}
            onBlur={() => {
              setIsFocus(false);
            }}
            placeholder={placeHolder}
          />
          <div className="iconfont" style={isFocus ? styles : undefined}>
            &#xe601;
          </div>
        </div>
        <div id={`change-form-box-anime-${seq}`} className={style.otherInput}>
          {children}
          <div style={{ marginBottom: `15px` }}>
            <Button type="primary" style={{ marginRight: '10px' }} onClick={handleSubmit}>
              确定
            </Button>
            <Button
              onClick={() => {
                handleClose(false, isOpen, seq);
              }}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});
// 解决forwardRef报错
ChangeFormBox.displayName = 'ChangeFormBox';
export default ChangeFormBox;
