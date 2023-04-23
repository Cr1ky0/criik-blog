import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import isEmail from 'validator/lib/isEmail';

// css
import style from './index.module.scss';

// img
import img from '@/assets/images/blog-icon.png';

// antd
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

// ajax
import { loginAjax } from '@/api/user';

// interface
import { LoginFormData } from '@/interface';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useGlobalNotice } from '@/components/ContextProvider/NoticeProvider';

interface LoginFormProps {
  close: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ close }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const message = useGlobalMessage();
  const login = useCallback(async (values: LoginFormData) => {
    if (!isEmail(values.email)) {
      message.error('请输入正确的邮箱！');
      return;
    }
    try {
      setIsLoading(true);
      await loginAjax(values);
      await message.success('Successfully Log In');
      // 关闭窗口
      close();
      navigate(0);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
    }
  }, []);
  return (
    <div className={style.wrapper}>
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
              <a>Sing up</a>
            </Form.Item>

            <a className="login-form-forgot">Forgot password</a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={isLoading} htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginForm;
