import React, { useState } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// antd
import { Popover, Tag } from 'antd';

// interface
import { BlogTagBoxStatistic } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';

// util
import { getSideMenuItem } from '@/utils';
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
    <div className={`${style.wrapper} clearfix`}>
      <Popover content="作者信息" trigger="hover" placement="bottom">
        <div>
          <span className="iconfont">&#xe72e;</span>
          <span className={style.author}>{author}</span>
        </div>
      </Popover>
      <Popover content="发布时间" trigger="hover" placement="bottom">
        <div className={style.time}>
          <span className="iconfont">&#xe632;</span>
          {time}
        </div>
      </Popover>
      <Popover content="浏览量" trigger="hover" placement="bottom">
        <div className={style.views}>
          <span className="iconfont">&#xe66c;</span>
          {views}
        </div>
      </Popover>
      <Popover content="分类标签" trigger="hover" placement="bottom">
        <div className={style.classification}>
          <span className="iconfont">&#xe623;</span>
          <Tag className={style.tag} color={item ? item.color : undefined}>
            {item ? item.title : undefined}
          </Tag>
        </div>
      </Popover>
      <Popover content="点赞" trigger="hover" placement="bottom">
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
      </Popover>
      {/* User在才能点赞 */}
      {user ? (
        <Popover content="收藏" trigger="hover" placement="bottom">
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
        </Popover>
      ) : undefined}
    </div>
  );
};

export default BlogInfo;
