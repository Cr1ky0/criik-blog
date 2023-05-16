// 拦截器已经错误处理，像登录这样失败有其他错误处理操作的不用改封装
export const catchAsync =
  (fn: any) => async (values?: unknown, success?: (data?: any) => void, error?: (content: string) => void) => {
    // success error分别指定success和error的回调
    try {
      const response = await fn(values);
      if (success) success(response.data);
      return Promise.resolve(response.data);
    } catch (err: any) {
      // 错误输出全放这里
      if (error) {
        // 这里处理一些后端没有传递错误信息的状态码的消息输出
        error(err.data.message);
        return new Promise(() => {
          /* pass */
        });
      }
    }
  };
