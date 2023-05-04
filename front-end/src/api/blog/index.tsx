import { catchAsync } from '@/api';
import service from '@/utils/request';

// interface
import { addBlogObj, reqOptions, updateBlogObj } from '@/interface';

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

export const getCurBlog = async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return Promise.resolve(response.data);
};

export const updateBlogViewAjax = async (id: string, views: number) => {
  const response = await service.patch(`/api/blogs/updateViewOfBlog/${id}`, { views });
  return Promise.resolve(response.data);
};

export const updateCollectOfBlogAjax = async (id: string, isCollected: boolean) => {
  const response = await service.patch(`/api/blogs/updateCollectOfBlog/${id}`, { isCollected });
  return Promise.resolve(response.data);
};

export const updateLikesOfBlogAjax = async (id: string, likes: number) => {
  const response = await service.patch(`/api/blogs/updateLikesOfBlog/${id}`, { likes });
  return Promise.resolve(response.data);
};

export const getCollectedBlogsNum = async () => {
  const response = await service.get('/api/blogs/getSelfBlogs?fields=id&isCollected=true');
  return Promise.resolve(response.data.data.blogs.length);
};

export const getSelfBlogsOfCertain = async (option: reqOptions) => {
  const { page, fields, sort, limit, options } = option;
  const response = await service.get(
    '/api/blogs/getSelfBlogs?' +
      (page ? `page=${page}&` : '') +
      (fields ? `fields=${fields}&` : '') +
      (sort ? `sort=${sort}&` : '') +
      (limit ? `limit=${limit}&` : '') +
      (options ? `${options}` : '')
  );
  return Promise.resolve(response.data);
};
