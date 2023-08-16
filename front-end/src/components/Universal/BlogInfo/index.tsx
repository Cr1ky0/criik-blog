import React, { useState, useEffect } from 'react';
import Cookies from 'universal-cookie';

// css
import style from './index.module.scss';

// antd
import { Tag, Tooltip } from 'antd';

// interface
import { BlogTagBoxStatistic, BreadCrumbObj } from '@/interface';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { addLikeList, removeLikeList } from '@/redux/slices/blog';

// util
import { getBreadcrumbList } from '@/utils';

// api
import { updateLikesOfBlogAjax, updateCollectOfBlogAjax } from '@/api/blog';

// provider
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useIcons } from '@/components/ContextProvider/IconStore';
import { useViewport } from '@/components/ContextProvider/ViewportProvider';
import { BREAK_POINT } from '@/global';

interface BlogInfoProps {
  statistics: BlogTagBoxStatistic;
  showCollect?: boolean;
}

const isLiked = (likeList: string[], id: string) => {
  return likeList.some(likeId => likeId === id);
};
const BlogInfo: React.FC<BlogInfoProps> = ({ statistics, showCollect }) => {
  const { author, time, views, id, isCollected, likes } = statistics;
  const { width } = useViewport();
  const message = useGlobalMessage();
  const menus = useAppSelector(state => state.blogMenu.menuList);
  const icons = useIcons();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  // 点赞状态（游客也可以点赞，用redux管理（与评论类似））
  const likeList = useAppSelector(state => state.blog.likeList);
  const dispatch = useAppDispatch();
  // 收藏状态
  const [collected, setCollected] = useState(isCollected);
  const [likesNum, setLikesNum] = useState(likes);
  const [grandMenu, setGrandMenu] = useState<BreadCrumbObj[]>([]);
  const cookies = new Cookies();
  const user = cookies.get('user');

  useEffect(() => {
    const grand = getBreadcrumbList(menus, id, icons);
    grand.pop();
    setGrandMenu(grand);
  }, [menus]);

  useEffect(() => {
    setCollected(isCollected);
  }, [isCollected]);

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
    <div className={`${style.wrapper} ${themeMode === 'dark' ? style.dark : style.light}`}>
      <div className={style.leftWrapper}>
        <Tooltip title="作者信息" trigger="hover" placement="bottom">
          <div>
            <span className="iconfont">&#xe72e;</span>
            {author}
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
            {width > BREAK_POINT ? (
              grandMenu.map((menu, index) => {
                return (
                  <Tag
                    key={index}
                    className={style.tag}
                    color={menu.color}
                    style={{
                      border: themeMode === 'dark' ? 'none' : undefined,
                    }}
                  >
                    {menu.title}
                  </Tag>
                );
              })
            ) : (
              <Tag
                className={style.tag}
                color={grandMenu.length ? grandMenu[grandMenu.length - 1].color : undefined}
                style={{
                  border: themeMode === 'dark' ? 'none' : undefined,
                }}
              >
                {grandMenu.length ? grandMenu[grandMenu.length - 1].title : undefined}
              </Tag>
            )}
          </div>
        </Tooltip>
      </div>
      <div className={style.rightWrapper}>
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
        {/* User在才能收藏 */}
        {user && showCollect ? (
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
    </div>
  );
};

export default BlogInfo;
