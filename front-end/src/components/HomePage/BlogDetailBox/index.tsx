import React, { useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// antd
import { Tooltip } from 'antd';

// comp
import Classification from '@/components/HomePage/BlogDetailBox/Classification';
import BlogTimeLine from '@/components/HomePage/BlogDetailBox/BlogTimeLine';
import CollectedBlogs from '@/components/HomePage/BlogDetailBox/CollectedBlogs';

// global
import { THEME_COLOR } from '@/global';

// redux
import { useAppSelector } from '@/redux';

// util
import { getClassificationInfo } from '@/utils';

// api
import { getCollectedBlogsNum } from '@/api/blog';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

interface BlogDetailBoxProps {
  isMobile?: boolean;
}

const names = ['文章', '分类', '时间轴'];

const BlogDetailBox: React.FC<BlogDetailBoxProps> = ({ isMobile }) => {
  const message = useGlobalMessage();
  const timeline = useAppSelector(state => state.blog.timeLine);
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const [curChosen, setCurChosen] = useState(0);
  const [collectNum, setCollectNum] = useState(0);

  const handleClick = (index: number) => {
    const last = document.getElementById(`blog-detail-box-btn-${curChosen}`) as HTMLElement;
    const div = document.getElementById(`blog-detail-box-btn-${index}`) as HTMLElement;
    const lastContent = document.getElementById(`blog-detail-box-content-${curChosen}`) as HTMLElement;
    const nowContent = document.getElementById(`blog-detail-box-content-${index}`) as HTMLElement;
    lastContent.style.display = 'none';
    nowContent.style.display = 'block';
    last.classList.remove(style.onChosen);
    div.classList.add(style.onChosen);
    setCurChosen(index);
  };

  useEffect(() => {
    // 获取收藏数
    getCollectedBlogsNum().then(
      response => {
        setCollectNum(response);
      },
      err => {
        message.error(err.message);
      }
    );
  }, []);
  return (
    <div
      className={`${style.wrapper} clearfix ${isMobile ? '' : style.wrapperOnShadow} ${
        themeMode === 'dark' ? 'dark-2' : 'light'
      }`}
    >
      <div className={`${style.header}`}>
        {names.map((name, index) => {
          return (
            <Tooltip title={name} trigger="hover" placement="top" key={index}>
              <div>
                <div
                  className={`${curChosen === index ? style.onChosen : ''} ${
                    themeMode === 'dark' ? 'dark-3' : 'light-1'
                  }`}
                  id={`blog-detail-box-btn-${index}`}
                  onClick={() => {
                    handleClick(index);
                  }}
                >
                  {index === 0 ? (
                    <span className="iconfont">&#xe86a;</span>
                  ) : index === 1 ? (
                    <span className="iconfont">&#xe609;</span>
                  ) : (
                    <span className="iconfont">&#xe8c5;</span>
                  )}
                </div>
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div id="blog-detail-box-content" className={style.content}>
        <div id="blog-detail-box-content-0" className="clearfix">
          <div className={style.statistic}>
            <span className="iconfont">&#xe86a;</span>
            <span>{collectNum}</span>&nbsp;
            <span>收藏</span>
          </div>
          <CollectedBlogs></CollectedBlogs>
        </div>
        <div id="blog-detail-box-content-1" className="clearfix">
          <div className={style.statistic}>
            <span className="iconfont">&#xe609;</span>
            <span>{getClassificationInfo(menus).length}</span>&nbsp;
            <span>分类</span>
          </div>
          <Classification></Classification>
        </div>
        <div id="blog-detail-box-content-2" className="clearfix">
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
