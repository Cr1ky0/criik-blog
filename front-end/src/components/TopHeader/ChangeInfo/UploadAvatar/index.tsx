import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// antd
import { PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { Modal, Upload, Button } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';

// context
import { useAvatar } from '@/components/ContextProvider/AvatarPrivider';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

//api
import { updateMeAjax } from '@/api/user';

const UploadAvatar = () => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const message = useGlobalMessage();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const avatar = useAvatar();
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: `${user.avatar}`,
      status: 'done',
      url: avatar,
    },
  ]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    if (!file.url && !file.preview) {
      file.preview = src;
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // 提交
  const handleSubmit = async () => {
    setIsLoading(true);
    if (fileList[0].name === user.avatar) {
      message.error('请上传新的图片！');
      setIsLoading(false);
      return;
    }
    // 传base64格式的图片
    await updateMeAjax(
      { avatar: fileList[0].thumbUrl },
      async () => {
        await message.loadingSuccessAsync('上传中...', '上传成功！');
        navigate(0);
        setIsLoading(false);
      },
      () => {
        message.error('上传失败请重新再试！');
        setIsLoading(false);
      }
    );

    setIsLoading(false);
  };
  return (
    <div className={style.wrapper}>
      <div className={style.uploadBox}>
        <ImgCrop rotationSlider>
          <Upload
            action="/"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
        </ImgCrop>
        <Modal open={previewOpen} title="PhotoPreview" footer={null} onCancel={handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
      <div className={style.btn}>
        <Button onClick={handleSubmit} loading={isLoading}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default UploadAvatar;
