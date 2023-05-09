import React, { useEffect } from 'react';
import { Outlet } from 'react-router';

// comp
import SideMenu from '@/components/SideMenu';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch, useAppSelector } from '@/redux';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';
import Footer from '@/components/Footer';

const BlogPage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);

  useEffect(() => {
    // 初始化设置content和sider高度为视窗高度-TopHeader高度（为了设置滚动，且缩放时能看到全貌）
    const content = document.getElementById('blog-page-content-wrapper') as HTMLElement;
    const sider = document.getElementById('blog-page-sider-wrapper') as HTMLElement;
    content.style.height = window.innerHeight - 50 + 'px';
    if (sider) {
      sider.style.height = window.innerHeight - 50 + 'px';
    }
  }, [width, window.innerHeight]);

  useEffect(() => {
    dispatch(setChosenList([false, true, false, false]));
  }, []);

  return (
    <div className={`${style.wrapper} clearfix`}>
      {width > 850 ? (
        <div id="blog-page-sider-wrapper" className={style.sider}>
          <SideMenu noEdit={true} page="blog"></SideMenu>
        </div>
      ) : undefined}
      <div
        id="blog-page-content-wrapper"
        className={`${style.content} clearfix`}
        style={width < 850 ? { width: '100%' } : undefined}
      >
        {/* 选中状态 */}
        {selectedId ? <Outlet /> : <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>}
        <Footer></Footer>
      </div>
    </div>
  );
};
export default BlogPage;
