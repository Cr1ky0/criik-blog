import service from '@/utils/request';
import { catchAsync } from '@/api';

// interface
import { addMenuObj, updateMenuObj } from '@/interface';

export const addMenuAjax = catchAsync(async (values: addMenuObj) => {
  const response = await service.post(`/api/menus/`, values);
  return Promise.resolve(response);
});

export const deleteMenuAjax = catchAsync(async (id: string) => {
  const response = await service.delete(`/api/menus/${id}`);
  return Promise.resolve(response);
});

export const updateMenuAjax = catchAsync(async (values: updateMenuObj) => {
  const { id, title, icon, color } = values;
  const response = await service.patch(`/api/menus/${id}`, { title, icon, color });
  return Promise.resolve(response);
});
