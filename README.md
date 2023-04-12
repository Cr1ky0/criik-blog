# criik-blog 全栈项目

# Sever 端
1. 实际上处理是以链式结构进行的，调用next实际是调用下一个中间件，每一个中间件都处于链条中的一环，是有先后顺序的
2. 利用 protect 中间件，在验证过程中在 req 中存放 user，后续操作可从 req 中读取 user 来保证此次操作必定是针对该用户的操作
3. 利用setTimeout来设置session销毁时间可以不用cookie存放验证码
4. 对 async 函数进行封装
    ```js
        module.exports = (fn) => (req, res, next) => {
            // 注意这里req,res是形参，是上面传下来的
            fn(req, res, next).catch(next);
        };
        // 这里传入的函数是上面的fn
        // getUser = (req, res, next) => {fn(req,res,next).catch(next)}
        // 当该方法被调用根据传入的req,res,next执行内部fn(req,res,next).catch(next)
        exports.getUser = catchAsync(async (req, res, next) => {});
    ```
5. 错误处理利用appError + errorController + catchAsync实现自动错误处理
    - 基本流程：
        1. 错误出现时，return next(new AppError(message,status_code))
        2. 错误被catch后由next将错误进行传递
        3. 当传递到全局错误处理中间件时在定义的中间件中进行处理(errorController中暴露的回调函数)
6. 使用config.env配置一些全局属性，例如开发环境，在不同环境下执行不同代码