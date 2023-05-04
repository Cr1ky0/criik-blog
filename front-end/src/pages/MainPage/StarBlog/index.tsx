import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// antd
import { Pagination, Skeleton } from 'antd';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';
import { setChosen } from '@/redux/slices/blog';

// global
import { THEME_COLOR, FONT_COLOR } from '@/global';

// api
import { getCollectedBlogsNum } from '@/api/blog';

const choseList = ['收藏', '最多点赞', '最多浏览'];
const StarBlog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { width } = useViewport();
  const chosen = useAppSelector(state => state.blog.chosen);
  const blogsNum = useAppSelector(state => state.blog.blogsNum);
  const [curPage, setCurPage] = useState(1);
  const [collectNum, setCollectNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(setChosenList([false, false, false, true]));
    // 这里延迟展开是因为加载需要时间，不然开始就展开会很卡
    const timer = setTimeout(() => {
      const div = document.getElementById('blog-stars-wrapper') as HTMLElement;
      div.style.height = window.innerHeight - 50 + 'px';
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [width, window.innerHeight]);
  useEffect(() => {
    // 设置初始选中状态
    const now = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
    now.style.color = THEME_COLOR;
    const bar = now.getElementsByTagName('div')[1] as HTMLElement;
    bar.style.width = '100%';
    bar.style.marginLeft = '0';
    // 如果为收藏页，获取收藏总数
    if (chosen === 0) {
      getCollectedBlogsNum().then(res => setCollectNum(res));
    }
  }, []);
  return (
    <div id="blog-stars-wrapper" className={`${style.wrapper} clearfix`}>
      <div>
        <div className={style.options}>
          {choseList.map((choice, index) => {
            return (
              <div
                id={`blog-stars-btn-${index}`}
                key={index}
                onClick={e => {
                  // 动画
                  if (chosen !== index) {
                    const now = e.currentTarget;
                    now.style.color = THEME_COLOR;
                    const bar = now.getElementsByTagName('div')[1] as HTMLElement;
                    bar.style.width = '100%';
                    bar.style.marginLeft = '0';
                    const last = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
                    last.style.color = FONT_COLOR;
                    const lastBar = last.getElementsByTagName('div')[1] as HTMLElement;
                    lastBar.style.width = '0';
                    lastBar.style.marginLeft = '50%';
                    dispatch(setChosen(index));
                    navigate(`/stars?filter=${index}`);
                    setIsLoading(true);
                    setTimeout(() => {
                      setIsLoading(false);
                    }, 400);
                  }
                }}
              >
                <div>{choice}</div>
                <div className={style.bar}></div>
              </div>
            );
          })}
        </div>

        {/* loading状态 */}
        {isLoading ? (
          <div style={{ padding: '5vh' }}>
            <Skeleton active />
            <br />
            <Skeleton active />
            <br />
            <Skeleton active />
          </div>
        ) : (
          <>
            <div className={style.blogs}>
              <Outlet />
            </div>
            <div className={style.paginate}>
              <Pagination
                showSizeChanger={false}
                showQuickJumper
                pageSize={10}
                current={curPage}
                total={chosen === 0 ? collectNum : blogsNum}
                onChange={page => {
                  // 点击跳转
                  navigate(`?filter=${chosen}page=${page}`);
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 400);
                  setCurPage(page);
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StarBlog;
