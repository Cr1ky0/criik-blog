import service from '@/utils/request';
import { catchAsync } from '@/api';

const addMenuAjax = catchAsync(async (values: string) => {
  const response = await service.post(`/api/menus/addMenu`, values);
  return Promise.resolve(response);
});

const addBlogMenuAjax = catchAsync(async (values: string) => {
  const response = await service.get(`/images/users/${values}`, { responseType: 'blob' });
  return Promise.resolve(response);
});
