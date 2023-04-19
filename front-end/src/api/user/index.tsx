import service from '@/utils/request';

// interface
import { LoginFormData } from '@/interface';

export const loginAjax = async (values: LoginFormData) => {
  const response = await service.post('/api/users/login', values);
  return Promise.resolve(response.data);
};

export const avatarAjax = async (avatar: string) => {
  const response = await service.get(`/images/users/${avatar}`, { responseType: 'blob' });
  return Promise.resolve(response.data);
};
