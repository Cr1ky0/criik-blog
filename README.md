# 全栈 criik-blog（开发中）

仿 VuePress Theme Hope 主题利用 React 进行开发
<br>
![图片](./front-end/src/assets/images/show.png)

# Sever 端

1. 实际上整体是以链式结构进行的，调用 next 实际是调用下一个中间件，每一个中间件都处于链条中的一环，是有先后顺序的
2. 利用 protect 中间件，在验证过程中在 req 中存放 user，后续操作可从 req 中读取 user 来保证此次操作必定是针对该用户的操作
3. 利用 setTimeout 来设置 session 销毁时间
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
5. 错误处理利用 appError + errorController + catchAsync 实现自动错误处理
   - 基本流程：
     1. 错误出现时，return next(new AppError(message,status_code))
     2. 错误被 catch 后由 next 将错误进行传递
     3. 当传递到全局错误处理中间件时在定义的中间件中进行处理(errorController 中暴露的回调函数)
6. 使用 config.env 配置一些全局属性，例如开发环境，在不同环境下执行不同代码
7. 关于数据库加密
   - 在 mongodb/bin 内的 cfg 文件内设置
     > security:<br>
     > authorization: enabled
   - 打开后重启mongodb服务，然后use admin，进入admin数据库进行用户创建
     ```js
     db.createUser({user:"criiky0",pwd:"123456",roles:[{role:"readWrite",db:"criik-blog"}]});
     db.createUser({
       user: "criiky0",
       pwd: "123456",
       roles: [
         {
           role: "readWrite",
           db: "criik-blog",
         },
       ],
     });
     ```
   - 给其他数据库添加验证账户时，非 admin db 使用 readWrite 角色，因为子 db 没有 root 等角色
8. 文件、图片上传
    - multer+sharp
    - 一开始用的multer为直接上传的图片进行处理，但后面用了antd的上传组件
    - 只能获取到base64编码格式的图片，先去掉前缀后将编码转成buffer，再交给sharp处理，用不到multer
9. connect-mongo，session持久化
10. \*关于session和cookie
    - 使用express-session后，一旦设置session，会向前端发送一个session_id的cookie，在Set-Cookie请求头内
    - 如果Set-Cookie请求头内的cookie设置了http-only，那么前端无论如何都无法获取到该cookie（服务器可读cookie）
    - 那么此时前端如果想在axios发送请求时携带该cookie，需要打开withCredentials选项，此时会出现跨域问题
    - 这里我使用cors解决跨域，打开了withCredentials仍会出现跨域问题，需要配置cors的credentials:true,同时origin设为请求发送端的地址
    - 如果要使用不带http-only的cookie，用cookie-parser，在配置里面把httpOnly关了就行


# 前端
1. 安装 eslint 步骤:
   > npm i eslint -D <br/>
   > npx eslint --init <br/>
   > 注意在选择 eslint 初始化选项时将 node 和 browser 规范全选 <br/>
   > 第一个选项选第二个，带 find problems 就行，第三个会大面积报错
2. 配置 prettier:
   > yarn add prettier eslint-config-prettier eslint-plugin-prettier -D <br/>

   ```js
       // .eslintrc.json
       extends: [
           // 其他配置
           "plugin:prettier/recommended" // 增加项
       ],
       plugins: [
           // 其他配置
           "prettier"  // 增加项
       ],
   ```

3. react 项目中也可以 env 来配置全局变量
   ```js
       // .env
       // 必须以REACT_APP_开头否则失效
       REACT_APP_THEME_COLOR =
   ```
4. json 转化为数组格式

   ```js
   Object.values(response.data); // 仅转化value

   // 转化key和value
   const list: emojiObj[] = [];
   Object.entries(response.data).map(([key, value]) => {
     list.push({ key, value });
   });
   ```

5. 关于全局路径配置
   ```js
    // tsconfig.json
    "baseUrl": ".",
    "paths": { // 注意是paths不是path，在这找了半天bug
        "@/*": [
        "src/*"
        ]
    }
    // craco.config.js
    const path = require('path');
    const resolve = dir => path.resolve(__dirname, dir);
    module.exports = {
        webpack: {
            alias: {
            '@': resolve('src'),
            },
        },
    };
   ```
6. ts 里用 react-redux 的 hook 时，提前声明类别并暴露声明类别后的 hook
   ```js
   export type RootState = ReturnType<typeof store.getState>;
   export type AppDispatch = typeof store.dispatch;
   export const useAppDispatch: () => AppDispatch = useDispatch;
   export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
   ```
7. react 内设背景需要先将背景图片引入
   ```js
        import img from '@/assets/images/blog-icon.png'
        style={{ backgroundImage: `url(${img})` }}
   ```
8. react 内响应式布局见 ViewportProvider 组件（利用 context，全局包裹该组件，获取窗口大小），context可以让子元素获取传入的value，该value使用useContext(context名)即可获得，可以用改特性在Provider内部存放一些全局要用的功能和数据
9. 关于滚动条，如过要让一个子元素在其父元素内滚动，需要同时设置其父元素以及自身的高度，而且自身高度要大于父元素，否则无法产生滚动条
10. 用一个组件存放 antd icons，通过 context 让所有组件能够获取
11. 使用@reduxjs/toolkit 时利用 redux-persist 持久化的配置

    ```js
    //持久存储
    import {
      persistStore,
      persistReducer,
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER,
    } from "redux-persist";
    import storage from "redux-persist/lib/storage";

    const reducers = combineReducers({
      emoji,
      chosenList,
    });

    const persistConfig = {
      key: "root",
      storage: storage,
      blacklist: [],
    };
    const persistReducers = persistReducer(persistConfig, reducers);

    const store = configureStore({
      reducer: persistReducers,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
    });

    const persistor = persistStore(store);
    ```

12. axios 封装，这里和sever的catchAsync有异曲同工之妙，把错误拦截下来，因为已经在拦截器内做了统一处理，一些有其他错误处理的不用改封装
    ```js
        export const catchAsync =
            (fn: any) => async (values?: unknown, success?: () => void, error?: (content: string) => void) => {
                // success error分别指定success和error的回调
                try {
                const response = await fn(values);
                if (success) success();
                return Promise.resolve(response.data);
                } catch (err: any) {
                if (error) error(err.data.message);
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return new Promise(() => {});
                }
            };

        export const avatarAjax = catchAsync(async (values: string) => {
            // 这里定义的函数为上面的fn
            // 而调用该方法时的函数是catchAsync的返回值对应的函数所以在实际调用方法的时候才传入success和error回调，api只需要指定需要的数据参数
            const response = await service.get(`/images/users/${values}`, { responseType: 'blob' });
            return Promise.resolve(response);
        });
    ```
13. axios 请求回图片需要利用filereader进行处理转化为url可作为背景图
    ```js
    avatarAjax(user.avatar)
        .then(response => {
            const reader = new FileReader();
            reader.onload = e => {
                if (e.target) setAvatar(e.target.result as string);
            };
            reader.readAsDataURL(response);
        })
        .catch(err => {
            console.log(err.message);
        });
    ```
14. react严格模式包裹antd的布局组件会报错，包裹routes组件就行
15. 如果直接在标签上加style，这时如果状态发生改变，style被应用，如果该标签有动效css，则会被覆盖，最好的办法是替换两套style，然后利用动画进行设置，但是这样巨麻烦，我这里利用原生js做动效了，原生js设置的不会被覆盖掉，可以有动画，而且保证其展开大小一定是元素包裹大小，如果定义动画就无法知道包裹大小是多少
    ```js
        const div = document.getElementById('change-form-box-anime') as HTMLElement;
        // 如果打开就设置为scrollHeight否则为0
        if (state) div.style.height = div.scrollHeight + 'px';
        else div.style.height = '0';
    ```
16. forwardRef
    ```js
        // 泛型定义不要反了
        const FC = forwardRef<HTMLInputElement, ChangeFormBoxProps>((props,ref)=>{})
    ```
17. 使用useCallback时，注意设置deps，如果内部有useState的数据，那么deps需要加上该state否则内部state不会改变。
18. 关于antd的select选择器，如果要自定义选项，注意设置optionLabelProp="value"，意思是每次选择将选项的value值回填到选项框内，如果不填此项，默认将label回填到选项框内，如果此时label是一个ReactNode那么就会报错。