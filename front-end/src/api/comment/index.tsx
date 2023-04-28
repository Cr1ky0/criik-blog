import { catchAsync } from '@/api';
import service from '@/utils/request';
import { addCommentObj } from '@/interface';

export const addCommentAjax = catchAsync(async (obj: addCommentObj) => {
  const response = service.post('/api/comments', obj);
  return Promise.resolve(response);
});
