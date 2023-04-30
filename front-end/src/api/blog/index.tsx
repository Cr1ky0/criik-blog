import { catchAsync } from '@/api';
import service from '@/utils/request';

// interface
import { addBlogObj, updateBlogObj } from '@/interface';

export const addBlogAjax = catchAsync(async (values: addBlogObj) => {
  const response = await service.post('/api/blogs/', values);
  return Promise.resolve(response.data);
});

export const updateBlogAjax = catchAsync(async (values: updateBlogObj) => {
  const { blogId, data } = values;
  const response = await service.patch(`/api/blogs/${blogId}`, data);
  return Promise.resolve(response);
});

export const deleteBlogAjax = catchAsync(async (blogId: string) => {
  const response = await service.delete(`/api/blogs/${blogId}`);
  return Promise.resolve(response);
});

export const deleteBlogOfMenuAjax = catchAsync(async (blogId: string) => {
  const response = await service.delete(`/api/blogs/delBlogsOfMenu/${blogId}`);
  return Promise.resolve(response);
});
