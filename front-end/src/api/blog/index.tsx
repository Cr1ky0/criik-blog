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
  const response = await service.delete(`/api/blogs//delete/blogs/${blogId}`);
  return Promise.resolve(response);
});

export const getCurBlog = async (id: string) => {
  const response = await service.get(`/api/blogs/${id}`);
  return Promise.resolve(response.data);
};

export const updateBlogViewAjax = async (id: string, views: number) => {
  const response = await service.patch(`/api/blogs/update/view/${id}`, { views });
  return Promise.resolve(response.data);
};

export const updateCollectOfBlogAjax = async (id: string, isCollected: boolean) => {
  const response = await service.patch(`/api/blogs/update/collected/${id}`, { isCollected });
  return Promise.resolve(response.data);
};

export const updateLikesOfBlogAjax = async (id: string, likes: number) => {
  const response = await service.patch(`/api/blogs/update/like/${id}`, { likes });
  return Promise.resolve(response.data);
};

export const updateBelongOfBlogAjax = async (id: string, belongingMenu: string) => {
  const response = await service.patch(`/api/blogs/update/blog/${id}`, { belongingMenu });
  return Promise.resolve(response.data);
};
export const plusCommentCountAjax = async (id: string) => {
  const response = await service.patch(`/api/blogs/update/comment/add/${id}`);
  return Promise.resolve(response.data);
};

export const decreaseCommentCountAjax = async (id: string) => {
  const response = await service.patch(`/api/blogs/update/comment/decrease/${id}`);
  return Promise.resolve(response.data);
};

export const getBlogsWithCommentsAjax = catchAsync(async (option: ReqOptions) => {
  const { page, fields, sort, limit, options } = option;
  const response = await service.get(
    '/api/blogs/comments?' +
      (page ? `page=${page}&` : '') +
      (fields ? `fields=${fields}&` : '') +
      (sort ? `sort=${sort}&` : '') +
      (limit ? `limit=${limit}&` : '') +
      (options ? `${options}` : '')
  );
  return Promise.resolve(response.data);
});
export const getBlogsWithCommentsCountAjax = catchAsync(async () => {
  const response = await service.get('/api/blogs/counts/with/comments');
  return Promise.resolve(response.data);
});

export const getCollectedBlogsNum = async () => {
  const response = await service.get('/api/blogs/collections');
  return Promise.resolve(response.data);
};

export const getCollectedBlogs = improvedCatchAsync(async () => {
  const response = await service.get('/api/blogs/collected');
  return Promise.resolve(response.data);
});

export const getSelfBlogsOfCertain = async (option: ReqOptions) => {
  const { page, fields, sort, limit, options } = option;
  const response = await service.get(
    '/api/blogs?' +
      (page ? `page=${page}&` : '') +
      (fields ? `fields=${fields}&` : '') +
      (sort ? `sort=${sort}&` : '') +
      (limit ? `limit=${limit}&` : '') +
      (options ? `${options}` : '')
  );
  return Promise.resolve(response.data);
};

export const changeSortOfBlog = improvedCatchAsync(async (idList: string[]) => {
  const response = await service.patch('/api/blogs/update/sort/change', { idList });
  return Promise.resolve(response);
});
