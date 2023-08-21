import { catchAsync, improvedCatchAsync } from '@/api';
import service from '@/utils/request';

// interface
import { AddBlogObj, ReqOptions, UpdateBlogObj } from '@/interface';

export const addBlogAjax = catchAsync(async (values: AddBlogObj) => {
  const response = await service.post('/api/blogs/', values);
  return Promise.resolve(response.data);
});

export const updateBlogAjax = catchAsync(async (values: UpdateBlogObj) => {
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
  const response = await service.get(`/api/blogs/getBlog/${id}`);
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

export const updateBelongOfBlogAjax = async (id: string, belongingMenu: string) => {
  const response = await service.patch(`/api/blogs/updateBelongOfBlog/${id}`, { belongingMenu });
  return Promise.resolve(response.data);
};
export const plusCommentCountAjax = async (id: string) => {
  const response = await service.patch(`/api/blogs/plusCommentCount/${id}`);
  return Promise.resolve(response.data);
};

export const decreaseCommentCountAjax = async (id: string) => {
  const response = await service.patch(`/api/blogs/decreaseCommentCount/${id}`);
  return Promise.resolve(response.data);
};

export const getBlogsWithCommentsAjax = catchAsync(async (option: ReqOptions) => {
  const { page, fields, sort, limit, options } = option;
  const response = await service.get(
    '/api/blogs/getBlogsWithComments?' +
      (page ? `page=${page}&` : '') +
      (fields ? `fields=${fields}&` : '') +
      (sort ? `sort=${sort}&` : '') +
      (limit ? `limit=${limit}&` : '') +
      (options ? `${options}` : '')
  );
  return Promise.resolve(response.data);
});
export const getBlogsWithCommentsCountAjax = catchAsync(async () => {
  const response = await service.get('/api/blogs/getBlogsWithCommentsCount');
  return Promise.resolve(response.data);
});

export const getCollectedBlogsNum = async () => {
  const response = await service.get('/api/blogs/getCollectedBlogNum');
  return Promise.resolve(response.data);
};

export const getCollectedBlogs = improvedCatchAsync(async () => {
  const response = await service.get('/api/blogs/getCollectedBlog');
  return Promise.resolve(response.data);
});

export const getSelfBlogsOfCertain = async (option: ReqOptions) => {
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

export const changeSortOfBlog = improvedCatchAsync(async (idList: string[]) => {
  const response = await service.patch('/api/blogs/changeSort', { idList });
  return Promise.resolve(response);
});
