import React from 'react';
import { useNavigate } from 'react-router';

// css
import style from './index.module.scss';

// interface
import { SearchResultObj } from '@/interface/es';

// redux
import { useAppDispatch, useAppSelector } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';

interface SearchListProps {
  searchObj: SearchResultObj;
  match: string;
}

const getRenderNode = (str: string, match: string) => {
  const list = str.split(match);
  // 奇数项插入match（最大长度后面不插入）
  const newList: string[] = [];
  list.forEach((str, index) => {
    newList.push(str);
    if (index !== list.length - 1) {
      newList.push(match);
    }
  });
  return newList.map((str, index) => {
    if (str === match) {
      return (
        <span key={index} className={style.mark}>
          {str}
        </span>
      );
    } else return <span key={index}>{str}</span>;
  });
};

const SearchList: React.FC<SearchListProps> = ({ searchObj, match }) => {
  const { menu_title, blogs } = searchObj;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const themeMode = useAppSelector(state => state.universal.themeMode);
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
                dispatch(setSelectedId(blog.blog_id));
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
