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

// global
import { THEME_COLOR, FONT_COLOR } from '@/global';

const choseList = ['收藏', '最多点赞', '最多浏览'];
const StarBlog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { width } = useViewport();
  const [chosen, setChosen] = useState(0);
  const [curPage, setCurPage] = useState(1);
  const totalNum = useAppSelector(state => state.blog.blogsNum);

  useEffect(() => {
    // 初始化设置content和sider高度为视窗高度-TopHeader高度（为了设置滚动，且缩放时能看到全貌）
    const content = document.getElementById('blog-stars-wrapper') as HTMLElement;
    content.style.height = window.innerHeight - 50 + 'px';
  }, [width, window.innerHeight]);

  useEffect(() => {
    dispatch(setChosenList([false, false, false, true]));
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
                    setChosen(index);
                    navigate(`/stars?filter=${index}`);
                  }
                }}
              >
                <div>{choice}</div>
                <div className={style.bar}></div>
              </div>
            );
          })}
        </div>
        <div className={style.blogs}>
          <Outlet />
        </div>
        <div className={style.paginate}>
          <Pagination
            showSizeChanger={false}
            showQuickJumper
            pageSize={10}
            current={curPage}
            total={curPage === 0 ? 10 : totalNum}
            onChange={page => {
              // 点击跳转
              navigate(`?filter=${chosen}page=${page}`);
              setCurPage(page);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StarBlog;
