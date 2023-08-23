import React from 'react';
import { useLocation, useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// interface
import { SearchResultObj } from '@/interface/es';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { setJumpFlag } from '@/redux/slices/universal';
import { addHistory } from '@/redux/slices/es';

// util
import { getRenderNode } from '@/components/ElasticSearch/utils';
import { ANIME_HIDE_TIME } from '@/global';

interface SearchListProps {
  searchObj: SearchResultObj;
  match: string;
  closeBox: () => void;
}

const SearchList: React.FC<SearchListProps> = ({ searchObj, match, closeBox }) => {
  const { menu_title, blogs } = searchObj;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.universal.themeMode);
  const location = useLocation();
  return (
    <div className={style.wrapper}>
      <div className={style.header}>{menu_title}</div>
      <div className={`${style.content} ${themeMode === 'dark' ? style.listDark : style.listLight}`}>
        {blogs.map(blog => {
          return (
            <div
              key={blog.blog_id}
              className={style.singleWrapper}
              onClick={() => {
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
                dispatch(addHistory({ blog, match }));
                navigate('/blog');
              }}
            >
              <div className="iconfont">&#xe774;</div>
              <div className={style.info}>
                <div className={style.title}>{getRenderNode(blog.title, match)}</div>
                <div className={style.text}>{getRenderNode(blog.content, match)}</div>
              </div>
              <div className="iconfont">&#xe852;</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SearchList;
