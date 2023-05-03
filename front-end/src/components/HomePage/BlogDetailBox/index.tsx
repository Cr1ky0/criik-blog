import React, { useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Popover } from 'antd';

// comp
import Classification from '@/components/Classification';
import BlogTimeLine from '@/components/BlogTimeLine';

// global
import { THEME_COLOR } from '@/global';

// redux
import { useAppSelector } from '@/redux';

// util
import { getClassificationInfo } from '@/utils';

const names = ['分类', '文章', '时间轴'];
const BlogDetailBox = () => {
  const [curChosen, setCurChosen] = useState(0);
  const timeline = useAppSelector(state => state.blog.timeLine);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  useEffect(() => {
    const content = document.getElementById('blog-detail-box-content') as HTMLElement;
    // 设个限制不然刷新就+500
    if (content && parseInt(window.getComputedStyle(content).height) < 500) {
      // 这里是指定总容器的大小，因为开启定位后脱离文档流
      const h = parseInt(window.getComputedStyle(content.children[0].children[0]).height);
      content.style.height = 500 + h + parseInt(window.getComputedStyle(content).height) + 'px';
    }
  }, []);
  return (
    <div className={`${style.wrapper} clearfix`}>
      <div className={style.header}>
        {names.map((name, index) => {
          return (
            <Popover content={name} trigger="hover" placement="top" key={index}>
              <div
                id={`blog-detail-box-btn-${index}`}
                onClick={() => {
                  const last = document.getElementById(`blog-detail-box-btn-${curChosen}`) as HTMLElement;
                  const div = document.getElementById(`blog-detail-box-btn-${index}`) as HTMLElement;
                  const lastContent = document.getElementById(`blog-detail-box-content-${curChosen}`) as HTMLElement;
                  const nowContent = document.getElementById(`blog-detail-box-content-${index}`) as HTMLElement;
                  lastContent.style.opacity = '0';
                  nowContent.style.opacity = '1';
                  last.style.backgroundColor = 'rgba(0,0,0,.1)';
                  div.style.backgroundColor = THEME_COLOR;
                  setCurChosen(index);
                }}
              >
                {index === 0 ? (
                  <span className="iconfont">&#xe609;</span>
                ) : index === 1 ? (
                  <span className="iconfont">&#xe63e;</span>
                ) : (
                  <span className="iconfont">&#xe8c5;</span>
                )}
              </div>
            </Popover>
          );
        })}
      </div>
      <div id="blog-detail-box-content" className={style.content}>
        <div id="blog-detail-box-content-0">
          <div className={style.statistic}>
            <span className="iconfont">&#xe609;</span>
            <span>{getClassificationInfo(menus).length}</span>&nbsp;
            <span>分类</span>
          </div>
          <Classification></Classification>
        </div>
        <div id="blog-detail-box-content-1">
          <div className={style.statistic}>
            <span className="iconfont">&#xe63e;</span>
            <span>34</span>&nbsp;
            <span>文章</span>
          </div>
          <div></div>
        </div>
        <div id="blog-detail-box-content-2">
          <div className={style.statistic}>
            <span className="iconfont">&#xe8c5;</span>
            <span>{timeline.length}</span>&nbsp;
            <span>时间轴</span>
          </div>
          <BlogTimeLine></BlogTimeLine>
        </div>
      </div>
    </div>
  );
};
export default BlogDetailBox;
