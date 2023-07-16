import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Button, Form, Input } from 'antd';

// css
import style from './index.module.scss';

// api
import { SMTPConfig } from '@/interface/emailApi';
import { getSMTPConfig, setSMTPConfig } from '@/api/email';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

const EditOSS = () => {
  const msg = useGlobalMessage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [config, setConfig] = useState<SMTPConfig>();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(setSelectKey('smtp'));
  }, []);

  useEffect(() => {
    getSMTPConfig(
      '',
      res => {
        setConfig(res.data.smtp);
      },
      err => {
        msg.error(err);
      }
    );
    setTimeout(() => {
      setLoading(false);
    }, 50);
  }, []);

  return (
    <>
      {loading ? undefined : (
        <div className={style.wrapper}>
          <Form
            form={form}
            name="wrap"
            labelCol={{ flex: '120px' }}
            labelAlign="right"
            labelWrap
            colon={false}
            className={style.form}
            initialValues={{
              email: config?.email,
              password: config?.password,
              host: config?.host,
              port: config?.port,
            }}
            onFinish={values => {
              setSMTPConfig(
                values,
                () => {
                  msg.loadingSuccessAsync('保存中...', '保存成功!');
                  navigate(0);
                },
                err => {
                  msg.error(err);
                }
              );
            }}
          >
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="设定 Email" />
            </Form.Item>
            <Form.Item label="Password" name="password" rules={[{ required: true }]}>
              <Input placeholder="设定 Password" type="password" />
            </Form.Item>
            <Form.Item label="Host" name="host" rules={[{ required: true }]}>
              <Input placeholder="设定 Host" />
            </Form.Item>
            <Form.Item label="Port" name="port" rules={[{ required: true }]}>
              <Input placeholder="设定 port" />
            </Form.Item>
            <Form.Item label=" ">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button
                style={{ marginLeft: '20px' }}
                type="primary"
                danger
                onClick={() => {
                  form.setFieldsValue({
                    email: '',
                    password: '',
                    host: '',
                    port: '',
                  });
                }}
              >
                清除
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
};

export default EditOSS;
