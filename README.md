# criik-blog （备案中）

* 仿 VuePress Theme Hope 主题风格利用 React 进行开发
* 技术栈：ts + React + antd + nodejs + mongodb
*
目前仅作为个人博客使用，支持markdown语法（包括html）、支持数学公式katex、支持收藏（个人）、分类、时间轴以及博客管理等功能、支持个人信息修改。游客支持点赞和评论(
有敏感词过滤)。

* 已适配移动端

![1](./images/show-pc.png)
![2](./images/show-image%20(1).png)
![3](./images/show-image%20(2).png)
![4](./images/show-image%20(3).png)
![5](./images/show-image%20(4).png)

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
    - 打开后重启 mongodb 服务，然后 use admin，进入 admin 数据库进行用户创建
      ```js
      db.createUser({
        user: "criiky0",
        pwd: "123456",
        roles: [{ role: "readWrite", db: "criik-blog" }],
      });
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
    - 一开始用的 multer 为直接上传的图片进行处理，但后面用了 antd 的上传组件
    - 只能获取到 base64 编码格式的图片，先去掉前缀后将编码转成 buffer，再交给 sharp 处理，用不到 multer
9. connect-mongo，session 持久化
10. \*关于 session 和 cookie
    - 使用 express-session 后，一旦设置 session，会向前端发送一个 session_id 的 cookie，在 Set-Cookie 请求头内
    - 如果 Set-Cookie 请求头内的 cookie 设置了 http-only，那么前端无论如何都无法获取到该 cookie（服务器可读 cookie）
    - 那么此时前端如果想在 axios 发送请求时携带该 cookie，需要打开 withCredentials 选项，此时会出现跨域问题
    - 这里我使用 cors 解决跨域，打开了 withCredentials 仍会出现跨域问题，需要配置 cors 的 credentials:true,同时 origin
      设为请求发送端的地址
    - 如果要使用不带 http-only 的 cookie，用 cookie-parser，在配置里面把 httpOnly 关了就行

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
8. react 内响应式布局见 ViewportProvider 组件（利用 context，全局包裹该组件，获取窗口大小），context 可以让子元素获取传入的
   value，该 value 使用 useContext(context 名)即可获得，可以用改特性在 Provider 内部存放一些全局要用的功能和数据
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

12. axios 封装，这里和 sever 的 catchAsync 有异曲同工之妙，把错误拦截下来，因为已经在拦截器内做了统一处理，一些有其他错误处理的不用改封装

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

13. axios 请求回图片需要利用 filereader 进行处理转化为 url 可作为背景图
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
14. react 严格模式包裹 antd 的布局组件会报错，包裹 routes 组件就行
15. 如果直接在标签上加 style，这时如果状态发生改变，style 被应用，如果该标签有动效 css，则会被覆盖，最好的办法是替换两套
    style，然后利用动画进行设置，但是这样巨麻烦，我这里利用原生 js 做动效了，原生 js
    设置的不会被覆盖掉，可以有动画，而且保证其展开大小一定是元素包裹大小，如果定义动画就无法知道包裹大小是多少
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
17. 使用 useCallback 时，注意设置 deps，如果内部有 useState 的数据，那么 deps 需要加上该 state 否则内部 state 不会改变。
18. 关于 antd 的 select 选择器，如果要自定义选项，注意设置 optionLabelProp="value"，意思是每次选择将选项的 value
    值回填到选项框内，如果不填此项，默认将 label 回填到选项框内，如果此时 label 是一个 ReactNode 那么就会报错。
19. redux 异步处理流程
    - 首先，在组件内初始化请求数据并赋值 state
    - 更改或添加数据时，调用封装的 axios 方法
    - axios 方法成功后后端返回新的对象
    - 更新 state，将新对象通过 actions 添加到 state 内
    - 只需要给 action 传新数据就行，剩余逻辑全部在 reducer 内完成
20. 关于 antd 的全局 message，我是这么设置的
    - 先弄个 context 封装一下 message 的方法
    - 针对加载型消息，antd 的 message 本身提供 promise 调用，直接在消息完毕后 return 一个 fullfiled 状态的 Promise
    - 在处理业务逻辑的时候，await 调用消息方法，后面放消息结束后的操作即可（比如状态更新啥的）
    - 当然，message 要放在 axios 请求成功后的回调里面
21. 利用 moment 包处理 date 类型数据
22. 如何处理需要在组件加载后才能获取到的数据（如标签样式）
    ```js
        // 在组件内声明变量，在useEffect内获取相应结点的样式
        // 注意：不能直接在组件内获取标签结点，因为初始化时结点还没渲染，无法获取
        // 而根据组件生命周期可知，在render后useEffect内函数才调用，因此可以获取到对应标签结点
        const [primaryColors, setPrimaryColors] = useState([] as string[]);
        const [hoverColors, setHoverColors] = useState([] as string[]);

        useEffect(() => {
            const primColors =
            classInfoList && classInfoList.length
                ? classInfoList.map((_, index) => {
                    const div = document.getElementById(`classification-tag-${index}`) as HTMLElement;
                    return window.getComputedStyle(div).backgroundColor;
                })
                : [];
            const hovColors =
            primColors && primColors.length
                ? primColors.map(color => {
                    const colorRgb = getColorRgb(color as string);
                    return `rgba(${colorRgb[0] - 10},${colorRgb[1] - 10},${colorRgb[2] - 10})`;
                })
                : [];
            setHoverColors(hovColors);
            setPrimaryColors(primColors);
        }, []);
    ```

23. useMemo 在 render 前执行
24. 组件初始化通过 ajax 初始化数据步骤
    - 定义 state
    - useMemo 或 useEffect 内发送请求
    - 请求成功 setState
25. 关于ref，createRef后将结点赋值该ref后可在该组件使用useRef暴露接口在其他组件中使用该ref，一般用来操作dom结点
    - 注意，在使用中如果是子组件使用父组件的ref，无论是利用暴露接口方式还是props传递，初始化都无法获取到父组件的ref
    - 虽然初始化没法直接得到ref，但是可以在父组件useEffect里设置setState为ref的相关属性，或者添加listener监听该ref的属性
    - 然后将state传递给子组件，组件就可以获得ref的相关属性了
26. svg可以用来实现各种动画