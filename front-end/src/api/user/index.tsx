import service from '@/utils/request';

// TODO:封装错误处理

// interface
import { emailObj, LoginFormData, userInfoObj, userPswObj } from '@/interface';

export const loginAjax = async (values: LoginFormData) => {
  const response = await service.post('/api/users/login', values);
  return Promise.resolve(response.data);
};

export const avatarAjax = async (avatar: string) => {
  const response = await service.get(`/images/users/${avatar}`, { responseType: 'blob' });
  return Promise.resolve(response.data);
};

export const updateMyPswAjax = async (values: userPswObj) => {
  const response = await service.patch('/api/users/updateMyPassword', values);
  return Promise.resolve(response.data);
};

export const sendCodeAjax = async () => {
  const response = await service.post('/api/users/updateEmail');
  return Promise.resolve(response.data);
};

export const updateEmailAjax = async (values: emailObj) => {
  const response = await service.post('/api/users/sendLinkToNewEmail', values);
  return Promise.resolve(response.data);
};

export const updateMeAjax = async (values: userInfoObj) => {
  const response = await service.patch('/api/users/updateMe', values);
  return Promise.resolve(response.data);
};
