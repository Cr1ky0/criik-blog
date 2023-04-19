import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

// css
import style from './index.module.scss';
import './antd.scss';

// img
import img from '@/assets/images/blog-icon.png';

// antd
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, message, Input } from 'antd';

// utils
import { setBodyScroll } from '@/utils';

// global
import { SEVER_URL } from '@/global';

// interface
interface LoginFormProps {
  close: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ close }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  // error message
  const error = useCallback(() => {
    messageApi.open({
      type: 'error',
      content: '请输入正确的邮箱或密码!',
    });
  }, []);
  const onFinish = useCallback(async (values: any) => {
    try {
      const response = await axios.post(`${SEVER_URL}/api/users/login`, values);
      console.log(response.data);
      close();
      setBodyScroll();
      navigate('/');
    } catch (err: any) {
      if (err.response.status === 401) {
        error();
      }
    }
  }, []);
  return (
    <div className={style.wrapper}>
      {contextHolder}
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
          onFinish={onFinish}
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
