import service from '@/utils/request';
import Cookies from 'universal-cookie';
import { catchAsync } from '@/api';

// interface
import { emailObj, LoginFormData, userUpdateObj, userPswObj } from '@/interface';

export const loginAjax = catchAsync(async (values: LoginFormData) => {
  const response = await service.post('/api/users/login', values);
  return Promise.resolve(response);
});

export const updateLoginState = catchAsync(async () => {
  const response = await service.get(`/api/users/updateLoginState`);
  // 设置token
  // 有多个地方要用就不放外面了
  const cookies = new Cookies();
  cookies.set('user', response.data.data.user, { path: '/' });
  return Promise.resolve(response);
});

// 个人信息部分
// values是user.avatar
export const avatarAjax = catchAsync(async (values: string) => {
  const response = await service.get(`/images/users/${values}`, { responseType: 'blob' });
  return Promise.resolve(response);
});

// 通过UserId获取avatar
export const getAvatarOfUser = catchAsync(async (id: string) => {
  const response = await service.get(`/api/users/getUserAvatar/${id}`);
  return Promise.resolve(response);
});

export const updateMyPswAjax = catchAsync(async (values: userPswObj) => {
  const response = await service.patch('/api/users/updateMyPassword', values);
  return Promise.resolve(response);
});

export const sendCodeAjax = catchAsync(async () => {
  const response = await service.post('/api/users/updateEmail');
  return Promise.resolve(response);
});

export const updateEmailAjax = catchAsync(async (values: emailObj) => {
  const response = await service.post('/api/users/sendLinkToNewEmail', values);
  return Promise.resolve(response);
});

export const updateMeAjax = catchAsync(async (values: userUpdateObj) => {
  const response = await service.patch('/api/users/updateMe', values);
  return Promise.resolve(response);
});

export const getMyInfo = async () => {
  const response = await service.get('/api/users/getMyInfo');
  return Promise.resolve(response.data);
};
