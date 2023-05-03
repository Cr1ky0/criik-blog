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

export const getSelfBlogs = async (page: string) => {
  const response = await service.get(`/api/blogs/getSelfBlogs?page=${page}`);
  return Promise.resolve(response.data);
};

export const getHomePageBlogNum = async () => {
  const response = await service.get('/api/blogs/getSelfBlogNum');
  return Promise.resolve(response.data);
};
export const getCurBlog = async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return Promise.resolve(response.data);
};

export const updateBlogViewAjax = async (id: string, views: number) => {
  const response = await service.patch(`/api/blogs/updateViewOfBlog/${id}`, { views });
  return Promise.resolve(response.data);
};
