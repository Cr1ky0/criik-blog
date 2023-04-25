// 拦截器已经错误处理，像登录这样失败有其他错误处理操作的不用改封装

// TODO:处理所有的api的message输出
export const catchAsync =
  (fn: any) => async (values?: unknown, success?: () => void, error?: (content: string) => void) => {
    // success error分别指定success和error的回调
    try {
      const response = await fn(values);
      if (success) success();
      return Promise.resolve(response.data);
    } catch (err: any) {
      // 错误输出全放这里
      if (error) error(err.data.message);
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      return new Promise(() => {});
    }
  };
