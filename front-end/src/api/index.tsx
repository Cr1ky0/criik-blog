// 拦截器已经错误处理，像登录这样失败有其他错误处理操作的不用改封装
export const catchAsync = (fn: any) => async (values?: unknown, setIsLoading?: (state: boolean) => void) => {
  try {
    if (setIsLoading) setIsLoading(true);
    const response = await fn(values);
    return Promise.resolve(response.data);
  } catch (err: any) {
    if (setIsLoading) setIsLoading(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return new Promise(() => {});
  }
};
