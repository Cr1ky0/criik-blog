import { catchAsync } from '@/api';
import service from '@/utils/request';
import { AddReplyObj, UpdateCommentObj } from '@/interface';

export const addReplyAjax = catchAsync(async (obj: AddReplyObj) => {
  const response = service.post('/api/reply', obj);
  return Promise.resolve(response);
});

export const updateReplyAjax = catchAsync(async (data: UpdateCommentObj) => {
  const { id, likes } = data;
  const response = service.patch(`/api/reply/${id}`, { likes });
  return Promise.resolve(response);
});

export const deleteReplyAjax = catchAsync(async (id: string) => {
  const response = service.delete(`/api/reply/${id}`);
  return Promise.resolve(response);
});

export const delReplysOfCommentAjax = catchAsync(async (id: string) => {
  const response = service.delete(`/api/reply/delete/replys/${id}`);
  return Promise.resolve(response);
});
