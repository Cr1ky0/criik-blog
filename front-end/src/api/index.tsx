// 封装错误处理
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

// 封装错误处理
export const improvedCatchAsync =
  (fn: any) =>
  (
    values?: unknown, // values就是fn的参数
    success?: (data?: any) => void,
    error?: (content: string) => void,
    effect?: () => void
  ) => {
    // success error分别指定success和error的回调

    fn(values)
      .then((response?: any) => {
        if (success) success(response ? response.data : null);
      })
      .catch((err: any) => {
        if (error) {
          // 这里处理一些后端没有传递错误信息的状态码的消息输出
          error(err.data.message);
        }
      })
      .finally(() => {
        if (effect) effect();
        return new Promise(() => {
          // 终止调用链
        });
      });
  };
