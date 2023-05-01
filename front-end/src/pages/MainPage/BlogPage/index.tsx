import React, { useEffect, useState } from 'react';

// comp
import SideMenu from '@/components/SideMenu';
import BlogPageContent from '@/pages/MainPage/BlogPage/Content';

// antd
import { Skeleton } from 'antd';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch } from '@/redux';

const BlogPage = () => {
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const dispatch = useAppDispatch();
  const handleChange = (state: boolean) => {
    setLoading(state);
  };
  useEffect(() => {
    dispatch(setChosenList([false, true, false, false]));
    // 初始化动画
    const timer = setTimeout(() => {
      setInitLoading(false);
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`${style.wrapper} clearfix`}>
      {/* 初始化加载动画 */}
      {initLoading ? (
        <div className={style.loadingAnime}>
          <Skeleton active />
          <br />
          <Skeleton active />
          <br />
          <Skeleton active />
        </div>
      ) : (
        <>
          <div className={style.sider}>
            <SideMenu
              noEdit={true}
              setLoading={(state: boolean) => {
                setLoading(state);
              }}
            ></SideMenu>
          </div>
          <BlogPageContent setLoading={handleChange} loading={loading}></BlogPageContent>
        </>
      )}
    </div>
  );
};
export default BlogPage;
