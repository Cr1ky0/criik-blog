import service from '@/utils/request';
import { catchAsync } from '@/api';

// interface
import { addMenuObj } from '@/interface';

export const addMenuAjax = catchAsync(async (values: addMenuObj) => {
  const response = await service.post(`/api/menus/addMenu`, values);
  return Promise.resolve(response);
});

export const deleteMenuAjax = catchAsync(async (id: string) => {
  const response = await service.delete(`/api/menus/deleteMenu/${id}`);
  return Promise.resolve(response);
});
