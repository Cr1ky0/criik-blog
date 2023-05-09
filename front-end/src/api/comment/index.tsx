import { catchAsync } from '@/api';
import service from '@/utils/request';
import { addCommentObj, updateCommentObj } from '@/interface';
import axios from 'axios';

export const addCommentAjax = catchAsync(async (obj: addCommentObj) => {
  const response = service.post('/api/comments', obj);
  return Promise.resolve(response);
});

export const updateCommentAjax = catchAsync(async (data: updateCommentObj) => {
  const { id, likes } = data;
  const response = service.patch(`/api/comments/${id}`, { likes });
  return Promise.resolve(response);
});

export const filterCommentAjax = async (content: string) => {
  const response = axios.post(`https://api.itapi.cn/api/badword/query?key=yntVzCBul4AXFA1sdbHX9qmOiC&word=${content}`);
  return Promise.resolve(response);
};
