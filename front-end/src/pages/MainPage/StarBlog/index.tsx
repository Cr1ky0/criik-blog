import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';

// antd
import { Pagination } from 'antd';

// css
import style from './index.module.scss';

// comp
import Footer from '@/components/Footer';
import LoadingComp from '@/components/Universal/LoadingComp';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setChosenList } from '@/redux/slices/chosenList';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';
import { setChosen } from '@/redux/slices/blog';

// global
import { THEME_COLOR, FONT_COLOR } from '@/global';

// api
import { getCollectedBlogsNum } from '@/api/blog';
import BackToTopBtn from '@/components/Universal/BackToTopBtn';

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
  // timer
  const [timer, setTimer] = useState<any>();

  // Back To Top
  const wrapper = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);
  const backToTop = () => {
    (wrapper.current as HTMLDivElement).scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const current = wrapper.current as HTMLDivElement;
    const child = childRef.current as HTMLDivElement;

    // 初始化防止初始页面直接满进度
    setScrollHeight(1);
    setScrollTop(0);

    const handler = () => {
      // 总滚动大小 = 总滚动高度 - 视图大小
      if (current.scrollTop !== 0) {
        child.style.visibility = 'visible';
        child.style.opacity = '1';
      } else {
        child.style.visibility = 'hidden';
        child.style.opacity = '0';
      }
      setScrollHeight(current.scrollHeight - current.offsetHeight);
      setScrollTop(current.scrollTop);
    };
    current.addEventListener('scroll', handler);
    return () => {
      current.removeEventListener('scroll', handler);
    };
  }, []);

  // 设置初始高度
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

  // 设置初始选中状态
  useEffect(() => {
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
    <div id="blog-stars-wrapper" className={`${style.wrapper} clearfix`} ref={wrapper}>
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
                    if (timer) clearTimeout(timer);
                    setIsLoading(true);
                    setTimer(
                      setTimeout(() => {
                        setIsLoading(false);
                      }, 400)
                    );
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
                    navigate(`/stars?filter=${index}&page=${1}`);
                    setCurPage(1);
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
          <LoadingComp styles={{ padding: '5vh' }} changeImg={true}></LoadingComp>
        ) : (
          <>
            <div className={style.blogs}>
              <Outlet />
            </div>
          </>
        )}
      </div>
      <div className={style.paginate}>
        <Pagination
          showSizeChanger={false}
          showQuickJumper
          pageSize={10}
          current={curPage}
          total={chosen === 0 ? collectNum : blogsNum}
          onChange={page => {
            if (timer) clearTimeout(timer);
            setIsLoading(true);
            setTimer(
              setTimeout(() => {
                setIsLoading(false);
              }, 400)
            );
            setCurPage(page);
            // 点击跳转
            navigate(`?filter=${chosen}page=${page}`);
          }}
        />
      </div>
      <BackToTopBtn ref={childRef} scrollTop={scrollTop} scrollHeight={scrollHeight} onClick={backToTop}></BackToTopBtn>
      <Footer></Footer>
    </div>
  );
};

export default StarBlog;
