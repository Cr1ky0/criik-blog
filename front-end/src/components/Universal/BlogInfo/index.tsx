import React, { useState, useRef, useEffect } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// antd
import { Tag, Tooltip } from 'antd';

// interface
import { BlogTagBoxStatistic } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

// util
import { getColorHsl, getColorRgb, getSideMenuItem, rgbToHsl } from '@/utils';
import { updateCollectOfBlogAjax, updateLikesOfBlogAjax } from '@/api/blog';
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { addLikeList, removeLikeList } from '@/redux/slices/blog';

interface BlogInfoProps {
  statistics: BlogTagBoxStatistic;
}

const isLiked = (likeList: string[], id: string) => {
  return likeList.some(likeId => likeId === id);
};

const BlogInfo: React.FC<BlogInfoProps> = ({ statistics }) => {
  const message = useGlobalMessage();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const tagRef = useRef(null);
  // 点赞状态（游客也可以点赞，用redux管理（与评论类似））
  const likeList = useAppSelector(state => state.blog.likeList);
  const dispatch = useAppDispatch();
  const { author, time, views, belongingMenu, id, isCollected, likes } = statistics;
  const item = getSideMenuItem(menus, belongingMenu);
  // 收藏状态
  const [collected, setCollected] = useState(isCollected);
  const [likesNum, setLikesNum] = useState(likes);
  const cookies = new Cookies();
  const user = cookies.get('user');

  // 收藏
  const handleCollect = () => {
    updateCollectOfBlogAjax(id, !collected).then(
      response => {
        setCollected(response.data.updatedBlog.isCollected);
      },
      err => {
        message.error(err);
      }
    );
  };

  const handleLike = (state: 'add' | 'decrease') => {
    const isAdd = state === 'add';
    updateLikesOfBlogAjax(id, isAdd ? likesNum + 1 : likesNum - 1).then(
      response => {
        if (isAdd) dispatch(addLikeList(id));
        else dispatch(removeLikeList(id));
        setLikesNum(response.data.updatedBlog.likes);
      },
      err => {
        message.error(err);
      }
    );
  };

  return (
    <div className={`${style.wrapper} clearfix ${themeMode === 'dark' ? 'dark-font' : 'light-font'}`}>
      <Tooltip title="作者信息" trigger="hover" placement="bottom">
        <div>
          <span className="iconfont">&#xe72e;</span>
          <span className={style.author}>{author}</span>
        </div>
      </Tooltip>
      <Tooltip title="发布时间" trigger="hover" placement="bottom">
        <div className={style.time}>
          <span className="iconfont">&#xe632;</span>
          {time}
        </div>
      </Tooltip>
      <Tooltip title="浏览量" trigger="hover" placement="bottom">
        <div className={style.views}>
          <span className="iconfont">&#xe66c;</span>
          {views}
        </div>
      </Tooltip>
      <Tooltip title="分类标签" trigger="hover" placement="bottom">
        <div className={style.classification}>
          <span className="iconfont">&#xe623;</span>
          <Tag
            className={style.tag}
            color={item ? item.color : undefined}
            ref={tagRef}
            style={{
              border: themeMode === 'dark' ? 'none' : undefined,
            }}
          >
            {item ? item.title : undefined}
          </Tag>
        </div>
      </Tooltip>
      {/* 收藏标志 */}
      {isLiked(likeList, id) ? (
        <div
          className={style.like}
          onClick={() => {
            handleLike('decrease');
          }}
        >
          <span className="iconfont" style={{ color: '#FF0000' }}>
            &#xeca2;
          </span>
          <span>{likesNum}</span>
        </div>
      ) : (
        <div
          className={style.like}
          onClick={() => {
            handleLike('add');
          }}
        >
          <span className="iconfont">&#xeca1;</span>
          <span>{likesNum}</span>
        </div>
      )}
      {/* User在才能点赞 */}
      {user ? (
        <Tooltip title="收藏" trigger="hover" placement="bottom">
          <div className={style.collection} onClick={handleCollect}>
            {/* 收藏标志 */}
            {collected ? (
              <>
                <span className="iconfont" style={{ color: 'gold' }}>
                  &#xe86a;
                </span>
                <span>已收藏</span>
              </>
            ) : (
              <>
                <span className="iconfont">&#xe7df;</span>
                <span>收藏</span>
              </>
            )}
          </div>
        </Tooltip>
      ) : undefined}
    </div>
  );
};

export default BlogInfo;
