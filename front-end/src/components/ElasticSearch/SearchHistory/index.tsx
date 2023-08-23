import React, { useState } from 'react';
import { useNavigate } from 'react-router';

// css
import style from '@/components/ElasticSearch/SearchList/index.module.scss';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setJumpFlag } from '@/redux/slices/universal';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { delHistory } from '@/redux/slices/es';
import { ANIME_HIDE_TIME } from '@/global';

interface SearchHistoryProps {
  closeBox: () => void;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ closeBox }) => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const searchHistory = useAppSelector(state => state.es.history);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div className={style.wrapper}>
      <div className={style.header}>搜索历史</div>
      <div className={style.content}>
        {searchHistory.map(history => {
          const { blog } = history;
          return (
            <div
              key={blog.blog_id}
              className={`${style.singleWrapper} ${style.searchHistoryListWrapper} ${
                themeMode === 'dark' ? style.searchHistoryListWrapperDark : style.searchHistoryListWrapperLight
              }`}
              onClick={() => {
                if (!isDragging) {
                  closeBox();
                  // 当前是blog页面则不设置标志，因为默认进入页面会加载动画
                  if (location.pathname === '/blog') {
                    dispatch(setJumpFlag(true));
                    setTimeout(() => {
                      dispatch(setSelectedId(blog.blog_id));
                    }, ANIME_HIDE_TIME);
                  } else {
                    dispatch(setSelectedId(blog.blog_id));
                  }
                  navigate('/blog');
                }
              }}
            >
              <div className="iconfont">&#xe7bb;</div>
              <div className={style.info}>
                <div className={style.title}>{blog.title}</div>
                <div className={style.text}>{blog.content}</div>
              </div>
              <div className={`iconfont ${style.delHistory}`}>
                <div
                  onClick={e => {
                    e.stopPropagation();
                    dispatch(delHistory(blog.blog_id));
                  }}
                  onMouseDown={() => {
                    setIsDragging(true);
                  }}
                  onMouseUp={() => {
                    setIsDragging(false);
                  }}
                >
                  &#xe6dc;
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SearchHistory;
