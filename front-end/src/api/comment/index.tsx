import { catchAsync } from '@/api';
import service from '@/utils/request';
import { AddCommentObj, UpdateCommentObj } from '@/interface';
import axios from 'axios';

export const addCommentAjax = catchAsync(async (obj: AddCommentObj) => {
  const response = service.post('/api/comments', obj);
  return Promise.resolve(response);
});

export const updateCommentAjax = catchAsync(async (data: UpdateCommentObj) => {
  const { id, likes } = data;
  const response = service.patch(`/api/comments/${id}`, { likes });
  return Promise.resolve(response);
});

export const deleteCommentAjax = catchAsync(async (id: string) => {
  const response = service.delete(`/api/comments/${id}`);
  return Promise.resolve(response);
});

export const getReplysOfComment = catchAsync(async (id: string) => {
  const response = service.get(`/api/comments/getReplysOfComment/${id}`);
  return Promise.resolve(response);
});

export const filterCommentAjax = async (content: string) => {
  const response = axios.post(
    `https://api.itapi.cn/api/badword/query?key=yntVzCBul4AXFA1sdbHX9qmOiC&word=${content ? content : ''}`
  );
  return Promise.resolve(response);
};
