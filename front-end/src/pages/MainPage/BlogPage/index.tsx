import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

// comp
import SideMenu from '@/components/SideMenu';

// antd
import { Skeleton } from 'antd';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch, useAppSelector } from '@/redux';

const BlogPage = () => {
  const [initLoading, setInitLoading] = useState(true);
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);

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
            <SideMenu noEdit={true}></SideMenu>
          </div>
          <div id="blog-page-content-wrapper" className={`${style.content} clearfix`}>
            {/* 选中状态 */}
            {selectedId ? <Outlet /> : <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>}
          </div>
        </>
      )}
    </div>
  );
};
export default BlogPage;
