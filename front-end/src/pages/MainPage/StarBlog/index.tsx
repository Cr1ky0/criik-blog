import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import Footer from '@/components/Footer';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { setChosen } from '@/redux/slices/blog';

// api
import { getCollectedBlogsNum } from '@/api/blog';

const choseList = ['收藏', '最多点赞', '最多浏览'];
const StarBlog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const chosen = useAppSelector(state => state.blog.chosen);
  const blogsNum = useAppSelector(state => state.blog.blogsNum);
  const [curPage, setCurPage] = useState(1);
  const [collectNum, setCollectNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  // 可操作标志
  const [isOpt, setIsOpt] = useState<boolean>();

  // timer
  const [timer, setTimer] = useState<any>();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpt(true);
    // 设置初始选中状态
    dispatch(setChosenList([false, false, true, false]));
    const now = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
    now.classList.add(style.optionsOnChosen);
    // 如果为收藏页，获取收藏总数
    if (chosen === 0) {
      getCollectedBlogsNum().then(res => setCollectNum(res));
    }
  }, []);

  return (
    <div className={`${style.wrapper} clearfix`} ref={wrapper}>
      <div>
        <div className={style.options}>
          {choseList.map((choice, index) => {
            return (
              <div
                id={`blog-stars-btn-${index}`}
                key={index}
                onClick={e => {
                  // 动画
                  if (isOpt) {
                    setIsOpt(false);
                    if (chosen !== index) {
                      setIsLoading(true);
                      setTimeout(() => {
                        setIsOpt(true);
                      }, 1300);
                      // 导航样式变化
                      const now = e.currentTarget;
                      now.classList.add(style.optionsOnChosen);
                      const last = document.getElementById(`blog-stars-btn-${chosen}`) as HTMLElement;
                      last.classList.remove(style.optionsOnChosen);
                      dispatch(setChosen(index));
                      // 跳转
                      setTimeout(() => {
                        navigate(`/stars?filter=${index}&page=${1}`);
                        setCurPage(1);
                        setIsLoading(false);
                      }, 500);
                    }
                  }
                }}
              >
                <div>{choice}</div>
                <div className={style.bar}></div>
              </div>
            );
          })}
        </div>

        <div className={`${style.blogs} ${isLoading ? 'hideAnime' : 'showAnime'}`}>
          <Outlet />
        </div>
      </div>
      <div className={style.paginate}>
        <Pagination
          showSizeChanger={false}
          showQuickJumper
          pageSize={10}
          current={curPage}
          total={chosen === 0 ? collectNum : blogsNum}
          onChange={page => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
            if (timer) clearTimeout(timer);
            setIsLoading(true);
            setTimer(
              setTimeout(() => {
                setCurPage(page);
                // 点击跳转
                navigate(`?filter=${chosen}page=${page}`);
                setIsLoading(false);
              }, 500)
            );
          }}
        />
      </div>
      <Footer></Footer>
    </div>
  );
};

export default StarBlog;
