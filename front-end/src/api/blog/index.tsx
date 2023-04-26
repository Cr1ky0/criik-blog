import { catchAsync } from '@/api';
import service from '@/utils/request';

// interface
import { addBlogObj } from '@/interface';

export const addBlogAjax = catchAsync(async (values: addBlogObj) => {
  const response = await service.post('/api/blogs/', values);
  return Promise.resolve(response.data);
});
