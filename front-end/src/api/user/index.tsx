import service from '@/utils/request';

// interface
import { emailObj, LoginFormData, userInfoObj, userPswObj } from '@/interface';

// 拦截器已经错误处理，像登录这样失败有其他错误处理操作的不用改封装
export const catchAsync = (fn: any) => async (values?: unknown) => {
  try {
    const response = await fn(values);
    return Promise.resolve(response.data);
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise(() => {});
  }
};

export const loginAjax = async (values: LoginFormData) => {
  const response = await service.post('/api/users/login', values);
  return Promise.resolve(response.data);
};

// values是user.avator
export const avatarAjax = catchAsync(async (values: string) => {
  const response = await service.get(`/images/users/${values}`, { responseType: 'blob' });
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

export const updateMeAjax = catchAsync(async (values: userInfoObj) => {
  const response = await service.patch('/api/users/updateMe', values);
  return Promise.resolve(response);
});
