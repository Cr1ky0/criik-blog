import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';

// img
import img from '@/assets/images/blog-icon.webp';

// css
import style from './index.module.scss';

// ajax
import { loginAjax, sendCaptcha } from '@/api/user';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch } from '@/redux';
import { setLoginFormOpen } from '@/redux/slices/universal';
import { setUser } from '@/redux/slices/user';

// comp
import Loading from '@/components/Universal/Loading';
import { trottle } from '@/utils';

const LoginForm = () => {
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPsw, setShowPsw] = useState(false);
  const [captchaSvg, setCaptchaSvg] = useState<TrustedHTML>();
  const [checked, setChecked] = useState(false);

  // value
  const [email, setEmail] = useState(localStorage.getItem('login_email') || '');
  const [psw, setPsw] = useState(localStorage.getItem('login_psw') || '');
  const [code, setCode] = useState('');

  // placeholder
  const ref1 = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const ref3 = useRef<HTMLDivElement>(null);
  // scroll bar
  const ref4 = useRef<HTMLDivElement>(null);
  const ref5 = useRef<HTMLDivElement>(null);
  const ref6 = useRef<HTMLDivElement>(null);

  const cookies = new Cookies();

  const onFocus = (ref1: React.RefObject<HTMLDivElement>, ref2: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    const scroll = ref2.current as HTMLDivElement;
    if (!div.classList.contains(style.placeHolderOutInit)) {
      div.classList.add(style.placeHolderOut);
    }
    div.classList.remove(style.placeHolderIn);
    div.classList.remove(style.blurColor);
    scroll.classList.add(style.barScroll);
  };

  const onBlur = (ref1: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    div.classList.add(style.placeHolderIn);
    div.classList.remove(style.placeHolderOut);
    div.classList.remove(style.placeHolderOutInit);
  };

  const onBlur2 = (ref1: React.RefObject<HTMLDivElement>, ref2: React.RefObject<HTMLDivElement>) => {
    const div = ref1.current as HTMLDivElement;
    const scroll = ref2.current as HTMLDivElement;
    scroll.classList.remove(style.barScroll);
    div.classList.add(style.blurColor);
  };

  const login = trottle(() => {
    if (!isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        loginAjax(
          { email, password: psw, captcha: code },
          async data => {
            const { data: aData, token } = data;
            // 设置token
            delete aData.user['_id'];
            await message.loadingSuccessAsync('登录中...', '登录成功');
            await dispatch(setLoginFormOpen(false));
            // 设置cookie持续时间90天
            const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
            cookies.set('user', aData.user, { path: '/', expires });
            cookies.set('token', token, { path: '/', expires });
            dispatch(setUser(aData.user));
            // 如果checked则保存一下账号密码到localStorage
            if (checked) {
              localStorage.setItem('login_email', email);
              localStorage.setItem('login_psw', psw);
            }
            navigate(0);
          },
          content => {
            message.error(content);
          },
          () => {
            setIsLoading(false);
          }
        );
      }, 300);
    }
  }, 1000);

  // 先请求一个code
  useEffect(() => {
    sendCaptcha(
      '',
      res => {
        setCaptchaSvg(res);
      },
      err => {
        message.error(err);
      }
    );
  }, []);

  // 如果设置了记录密码，则把样式定为有值
  useEffect(() => {
    if (email) {
      setChecked(true);
      const div1 = ref1.current as HTMLDivElement;
      const div2 = ref2.current as HTMLDivElement;
      div1.classList.add(style.placeHolderOutInit);
      div2.classList.add(style.placeHolderOutInit);
      div1.classList.add(style.blurColor);
      div2.classList.add(style.blurColor);
    }
  }, []);

  // 监听回车和ESC
  useEffect(() => {
    const trottle = () => {
      let valid = true;
      return (e: globalThis.KeyboardEvent) => {
        if (valid) {
          valid = false;
          if (e.key.toUpperCase() === 'ENTER') {
            login();
          }
          if (e.key.toUpperCase() === 'ESCAPE') {
            dispatch(setLoginFormOpen(false));
          }
          // 每500ms执行一次
          setTimeout(() => {
            valid = true;
          }, 500);
        }
      };
    };

    const listener = trottle();

    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [login]);

  const captcha = () => {
    sendCaptcha(
      '',
      res => {
        setCaptchaSvg(res);
      },
      err => {
        message.error(err);
      }
    );
  };
  return (
    <div className={style.mask}>
      <div className={`${style.wrapper} animate__animated animate__zoomIn `}>
        <div
          className={`${style.closeBtn} iconfont`}
          onClick={() => {
            dispatch(setLoginFormOpen(false));
          }}
        >
          &#xe6dc;
        </div>
        <div className={style.header}>
          <div className={style.logo} style={{ backgroundImage: `url(${img})` }}></div>
          <div className={style.login}>
            <div>登录</div>
            <div></div>
          </div>
        </div>
        <form className={style.form}>
          <div className={style.input}>
            <input
              value={email}
              type="text"
              onFocus={() => {
                onFocus(ref1, ref4);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref1);
                onBlur2(ref1, ref4);
              }}
              onChange={e => {
                setEmail(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref1}>
              用户邮箱
            </div>
            <div ref={ref4}></div>
          </div>
          <div className={style.input}>
            <input
              value={psw}
              type={showPsw ? 'text' : 'password'}
              onFocus={() => {
                onFocus(ref2, ref5);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref2);
                onBlur2(ref2, ref5);
              }}
              onChange={e => {
                setPsw(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref2}>
              登录密码
            </div>
            <div
              className={`${style.isShowPsw} iconfont`}
              onClick={() => {
                setShowPsw(!showPsw);
              }}
            >
              {showPsw ? <>&#xe605;</> : <>&#xe607;</>}
            </div>
            <div ref={ref5}></div>
          </div>
          <div className={style.input}>
            <input
              maxLength={5}
              type="text"
              onFocus={() => {
                onFocus(ref3, ref6);
              }}
              onBlur={e => {
                if (!e.target.value) onBlur(ref3);
                onBlur2(ref3, ref6);
              }}
              onChange={e => {
                setCode(e.target.value);
              }}
            />
            <div className={style.placeHolder} ref={ref3}>
              图形验证码
            </div>
            <div className={style.captcha} onClick={captcha} dangerouslySetInnerHTML={{ __html: captchaSvg! }}></div>
            <div ref={ref6}></div>
          </div>
          <div className={style.func}>
            <label htmlFor="remember-psw">
              <input
                id="remember-psw"
                type="checkbox"
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                }}
              />
              <div>记住密码</div>
            </label>
          </div>
          <div className={style.submit} onClick={login}>
            <div className="iconfont">{isLoading ? <Loading></Loading> : <>&#xe73c;&nbsp;登录</>}</div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
