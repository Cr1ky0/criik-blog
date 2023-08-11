import React, { useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';

// util
import { getSideMenuItem } from '@/utils';

// interface
import { BlogObj, SideMenuItem } from '@/interface';
import { setIsLoading } from '@/redux/slices/progressbar';
import { setJumpFlag } from '@/redux/slices/universal';

interface ContextObj {
  title: string;
  blogId: string;
}

interface ContextRelation {
  last: ContextObj;
  next: ContextObj;
}

// 判断当前blog是否有前后文
const getState: (menus: SideMenuItem[], blogId: string) => ContextRelation = (menus, blogId) => {
  const blog = getSideMenuItem(menus, blogId) as BlogObj;
  const menu = getSideMenuItem(menus, blog?.belongingMenu) as SideMenuItem;
  const blogs = menu.blogs as BlogObj[];
  const last = {} as ContextObj;
  const next = {} as ContextObj;
  blogs.forEach((blog, index) => {
    if (blog.id === blogId)
      if (index === blogs.length - 1 && index !== 0) {
        // 无后文
        last.title = blogs[index - 1].title;
        last.blogId = blogs[index - 1].id;
      } else if (index === 0 && blogs.length > 1) {
        // 无前文
        next.title = blogs[index + 1].title;
        next.blogId = blogs[index + 1].id;
      } else if (blogs.length === 1) {
        // 无前后文
      } else {
        // 有前后文
        const lastBlog = blogs[index - 1];
        const nextBlog = blogs[index + 1];
        last.title = lastBlog.title;
        last.blogId = lastBlog.id;
        next.title = nextBlog.title;
        next.blogId = nextBlog.id;
      }
  });
  return { last, next } as ContextRelation;
};

const NextPage = () => {
  const selectedId = useAppSelector(state => state.blogMenu.selectedId);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const dispatch = useAppDispatch();
  const [relation, setRelation] = useState<ContextRelation>(getState(menus, selectedId));

  const handleClick = (id: string) => {
    dispatch(setJumpFlag(true));
    setTimeout(() => {
      dispatch(setSelectedId(id));
    }, 950);
  };

  useEffect(() => {
    setRelation(getState(menus, selectedId));
  }, [selectedId]);
  return (
    <div className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}>
      {Object.keys(relation.last).length !== 0 ? (
        <div
          className={style.last}
          style={{ width: Object.keys(relation.next).length !== 0 ? undefined : '95%' }}
          onClick={() => {
            handleClick(relation.last.blogId);
          }}
        >
          <div>{'<上一页'}</div>
          <div className="iconfont">&#xe627;&nbsp;{relation.last.title}</div>
        </div>
      ) : undefined}
      {Object.keys(relation.next).length !== 0 ? (
        <div
          className={style.next}
          style={{ width: Object.keys(relation.last).length !== 0 ? undefined : '95%' }}
          onClick={() => {
            handleClick(relation.next.blogId);
          }}
        >
          <div>{'下一页>'}</div>
          <div>
            <span>{relation.next.title}</span>
            &nbsp;
            <div className="iconfont">&#xe627;</div>
          </div>
        </div>
      ) : undefined}
    </div>
  );
};

export default NextPage;
