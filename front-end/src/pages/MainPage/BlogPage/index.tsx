import React, { createRef, useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router';

// antd
import { Drawer } from 'antd';

// comp
import SideMenu from '@/components/SideMenu';
import BackToTopBtn from '@/components/Universal/BackToTopBtn';
import Footer from '@/components/Footer';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch, useAppSelector } from '@/redux';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// wrapper ref
const divRef = createRef<HTMLDivElement>();

const BlogPage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  // Mobile Menu Open State
  const [open, setOpen] = useState(false);

  // TODO:回顶部按钮有性能问题，待解决
  // Back To Top
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const childRef = useRef<HTMLDivElement>(null);
  const backToTop = () => {
    (divRef.current as HTMLDivElement).scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  useEffect(() => {
    const current = divRef.current as HTMLDivElement;
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

  // 初始化设置content和sider高度为视窗高度-TopHeader高度（为了设置滚动，且缩放时能看到全貌）
  useEffect(() => {
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
      <div id="blog-page-sider-wrapper" className={style.sider}>
        <SideMenu noEdit={true} page="blog"></SideMenu>
      </div>
      <div ref={divRef} id="blog-page-content-wrapper" className={`${style.content} clearfix`}>
        {/* 选中状态 */}
        {selectedId ? <Outlet /> : <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>}
        <BackToTopBtn
          ref={childRef}
          scrollTop={scrollTop}
          scrollHeight={scrollHeight}
          onClick={backToTop}
        ></BackToTopBtn>
        <Footer></Footer>
      </div>
      <div
        className={style.mobileMenu}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="iconfont">&#xe7f4;</div>
      </div>
      {/* Mobile Menu */}
      <Drawer
        placement="top"
        open={open}
        maskClosable={true}
        onClose={() => {
          setOpen(false);
        }}
        destroyOnClose={false}
        height="70%"
        rootStyle={{ border: 'none', outline: 'none' }}
      >
        <SideMenu
          noEdit={true}
          page="blog"
          closeMenu={() => {
            setOpen(false);
          }}
        ></SideMenu>
      </Drawer>
    </div>
  );
};
export default BlogPage;

export const useBlogPageContentWrapper = () => {
  return useRef(divRef);
};
