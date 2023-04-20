import React, { CSSProperties, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Button } from 'antd';

// global
import { THEME_COLOR } from '@/global';
import { doc } from 'prettier';

// interface
interface ChangeFormBoxProps {
  placeHolder?: string;
  title?: string;
  isOpen: boolean;
  children?: React.ReactNode;
  handleClick: (state: boolean) => void;
}

// children必须是按照制定规范的块
const ChangeFormBox: React.FC<ChangeFormBoxProps> = props => {
  const { placeHolder, title, isOpen, children, handleClick } = props;
  const [isFocus, setIsFocus] = useState(false);
  const styles: CSSProperties = { color: THEME_COLOR, borderColor: THEME_COLOR };
  return (
    <div className={style.wrapper} style={{ border: isOpen ? '1px solid rgba(0,0,0,.2)' : '1px solid transparent' }}>
      <div className={style.title}>{title}</div>
      <div className={style.form}>
        <form>
          <div
            className={style.mainInput}
            onClick={() => {
              handleClick(true);
            }}
          >
            <input
              type="text"
              onFocus={() => {
                setIsFocus(true);
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
          <div id="change-form-box-anime" className={isOpen ? style.otherInputOnOpen : style.otherInputOnClose}>
            {children}
            <div style={{ marginBottom: `15px` }}>
              <Button type="primary" style={{ marginRight: '10px' }}>
                确定
              </Button>
              <Button
                onClick={() => {
                  handleClick(false);
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeFormBox;
