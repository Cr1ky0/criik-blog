import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';
import './antd.scss';

// img
import img from '@/assets/images/blog-icon.png';

// antd
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, message, Input } from 'antd';

// ajax
import { loginAjax } from '@/api/user';

// utils
import { setBodyScroll } from '@/utils';

// interface
import { LoginFormData } from '@/interface';

interface LoginFormProps {
  close: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ close }) => {
  const navigate = useNavigate();
  const login = useCallback(async (values: LoginFormData) => {
    try {
      const response = await loginAjax(values);
      // 设置token
      const cookies = new Cookies();
      cookies.set('user', response.data.user, { path: '/' });
      cookies.set('token', response.token, { path: '/' });
      // 关闭窗口
      close();
      // 设置滚动条
      setBodyScroll();
      navigate('/');
      message.success('登录成功！');
    } catch (err: any) {
      if (err.status === 401) {
        message.error('请输入正确的邮箱或密码！');
      } else {
        message.error('未知错误!');
      }
    }
  }, []);
  return (
    <div className={style.wrapper}>
      {/*{contextHolder}*/}
      <div className={style.header}>
        <div className={style.logoBox}>
          <div className={style.logo} style={{ backgroundImage: `url(${img})` }}></div>
          <div className={style.blogInfo}>CriikBlog</div>
        </div>
        <div className={style.tips}>登录您的账户</div>
      </div>
      <div className={style.form}>
        <Form
          name="normal_login"
          className="login-form"
          preserve={false}
          initialValues={{ remember: true }}
          onFinish={login}
        >
          <Form.Item name="email" rules={[{ required: true, message: '请输入邮箱！' }]}>
            <Input maxLength={30} prefix={<MailOutlined className="site-form-item-icon" />} placeholder="email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码！' }]}>
            <Input
              maxLength={16}
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item noStyle>
              <a href="">Sing up</a>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginForm;
