import service from '@/utils/request';
import { catchAsync, improvedCatchAsync } from '@/api';

// interface
import { AddMenuObj, UpdateMenuBelongFormData, UpdateMenuObj } from '@/interface';

export const addMenuAjax = catchAsync(async (values: AddMenuObj) => {
  const response = await service.post(`/api/menus/`, values);
  return Promise.resolve(response);
});

export const deleteMenuAjax = catchAsync(async (id: string) => {
  const response = await service.delete(`/api/menus/${id}`);
  return Promise.resolve(response);
});

export const updateMenuAjax = catchAsync(async (values: UpdateMenuObj) => {
  const { id, title, icon, color } = values;
  const response = await service.patch(`/api/menus/${id}`, { title, icon, color });
  return Promise.resolve(response);
});

export const getMenuAjax = async (id: string) => {
  const response = await service.get(`/api/menus/menu/${id}`);
  return Promise.resolve(response);
};

export const getSelfMenu = improvedCatchAsync(async () => {
  const response = await service.get(`/api/menus`);
  return Promise.resolve(response);
});

export const changeSort = improvedCatchAsync(async (idList: string[]) => {
  const response = await service.patch(`/api/menus/sort/change`, { idList });
  return Promise.resolve(response);
});

export const updateBelong = async (data: UpdateMenuBelongFormData) => {
  const response = await service.patch(`/api/menus/update/belong/${data.id}`, {
    belongingMenu: data.belongingMenu,
    isMain: data.isMain,
  });
  return Promise.resolve(response.data);
};
