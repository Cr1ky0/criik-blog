import { catchAsync } from '@/api';
import service from '@/utils/request';
import { addCommentObj, updateCommentObj } from '@/interface';

export const addCommentAjax = catchAsync(async (obj: addCommentObj) => {
  const response = service.post('/api/comments', obj);
  return Promise.resolve(response);
});

export const updateCommentAjax = catchAsync(async (data: updateCommentObj) => {
  const { id, likes } = data;
  const response = service.patch(`/api/comments/${id}`, { likes });
  return Promise.resolve(response);
});
