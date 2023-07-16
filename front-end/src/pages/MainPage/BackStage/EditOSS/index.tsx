import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// antd
import { Button, Form, Input } from 'antd';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch } from '@/redux';
import { setSelectKey } from '@/redux/slices/backstage';

// api
import { OSSConfig } from '@/interface/OSSApi';
import { getOSSObject, setOSSObject } from '@/api/OSS';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

const EditOSS = () => {
  const dispatch = useAppDispatch();
  const msg = useGlobalMessage();
  const navigate = useNavigate();
  const [config, setConfig] = useState<OSSConfig>();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  useEffect(() => {
    dispatch(setSelectKey('oss'));
    getOSSObject(
      '',
      res => {
        setConfig(res.data.OSSObject);
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
              accessKeyId: config?.accessKeyId,
              accessKeySecret: config?.accessKeySecret,
              bucket: config?.bucket,
              region: config?.region,
            }}
            onFinish={values => {
              setOSSObject(
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
            <Form.Item label="AccessKeyId" name="accessKeyId" rules={[{ required: true }]}>
              <Input placeholder="设定 AccessKeyId" />
            </Form.Item>
            <Form.Item label="AccessKeySecret" name="accessKeySecret" rules={[{ required: true }]}>
              <Input placeholder="设定 AccessKeySecret" type="password" />
            </Form.Item>
            <Form.Item label="Bucket" name="bucket" rules={[{ required: true }]}>
              <Input placeholder="设定 Bucket" />
            </Form.Item>
            <Form.Item label="Region" name="region" rules={[{ required: true }]}>
              <Input placeholder="设定 Region" />
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
                    accessKeyId: '',
                    accessKeySecret: '',
                    bucket: '',
                    region: '',
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
