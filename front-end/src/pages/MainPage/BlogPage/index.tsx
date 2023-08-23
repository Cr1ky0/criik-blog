import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router';

// antd
import { Drawer } from 'antd';

// comp
import SideMenu from '@/components/SideMenu';
import BlogToc2 from '@/components/BlogPage/BlogToc2';

// css
import style from './index.module.scss';

// redux
import { setChosenList } from '@/redux/slices/chosenList';
import { useAppDispatch, useAppSelector } from '@/redux';
import { setFadeOut, setIsLoading } from '@/redux/slices/progressbar';

// context
import { useViewport } from '@/components/ContextProvider/ViewportProvider';

// global
import { ANIME_HIDE_TIME, BACKGROUND_COLOR_DARK } from '@/global';
import { setJumpFlag } from '@/redux/slices/universal';
import { getOneBlogId, hasBlogOfId } from '@/utils';
import { setSelectedId } from '@/redux/slices/blogMenu';

const BlogPage = () => {
  const { width } = useViewport();
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const curBlogContent = useAppSelector(state => state.blog.curBlogContent);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const fadeOut = useAppSelector(state => state.progressbar.fadeOut);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const jumpFlag = useAppSelector(state => state.universal.jumpFlag);
  // Mobile Menu Open State
  const [open, setOpen] = useState(false);

  // 如果当前select不存在则重新选择
  useEffect(() => {
    if (!hasBlogOfId(menus, selectedId)) {
      dispatch(setSelectedId(getOneBlogId(menus)));
    }
  }, []);

  // 切换博客时滚动至top
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [selectedId]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // 导航按钮变色
  useEffect(() => {
    dispatch(setChosenList([false, true, false, false]));
  }, []);

  // 打开滚动条
  useEffect(() => {
    // 如果先前打开了滚动条要先关闭
    dispatch(setIsLoading(false));
    setTimeout(() => {
      dispatch(setIsLoading(true));
    }, 50);
  }, []);

  useEffect(() => {
    dispatch(setFadeOut(false));
  }, []);

  useEffect(() => {
    if (jumpFlag) {
      // 重置jumpFLag标志
      dispatch(setJumpFlag(false));
      dispatch(setFadeOut(true));
      setTimeout(() => {
        dispatch(setFadeOut(false));
      }, ANIME_HIDE_TIME);
      // 如果先前打开了滚动条要先关闭
      // dispatch(setIsLoading(false));
      // setTimeout(() => {
      //   dispatch(setIsLoading(true));
      // }, 50);
      // 打开FadeOut（FadeOut动画开始，持续时间ns）
      // setTimeout(() => {
      //   // 执行操作并取消fadeOut（FadeIn动画执行）
      //   dispatch(setFadeOut(false));
      // }, DELAY_DISPATCH_TIME);
    }
  }, [jumpFlag]);

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark' : 'light'}`}>
      <div className={`${style.sider} showAnime`}>
        <div>
          <SideMenu noEdit={true} page="blog"></SideMenu>
        </div>
      </div>
      <div className={`${style.content} clearfix`}>
        {/* 选中状态 */}
        {selectedId ? <Outlet /> : <div style={{ fontSize: '24px' }}>当前没有博客，请添加博客后访问！</div>}
      </div>
      <div
        className={`${style.toc} ${fadeOut ? 'hideAnime' : 'showAnime'}`}
        style={width > 1100 ? undefined : { display: 'none' }}
      >
        {selectedId ? <BlogToc2 text={curBlogContent}></BlogToc2> : undefined}
      </div>
      {/* Mobile Menu */}
      <div
        className={style.mobileMenu}
        onClick={() => {
          setOpen(true);
        }}
      >
        <div className="iconfont">&#xe7f4;</div>
      </div>
      <Drawer
        placement="top"
        open={open}
        maskClosable={true}
        onClose={() => {
          setOpen(false);
        }}
        destroyOnClose={false}
        height="100%"
        rootStyle={{ border: 'none', outline: 'none' }}
        bodyStyle={{ backgroundColor: themeMode === 'dark' ? BACKGROUND_COLOR_DARK : undefined }}
        headerStyle={{ backgroundColor: themeMode === 'dark' ? BACKGROUND_COLOR_DARK : undefined }}
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
