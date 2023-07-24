import React, { useEffect, useState } from 'react';

// css
import style from './index.module.scss';

// api
import { getSelfBlogsOfCertain } from '@/api/blog';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';
import { useAppDispatch } from '@/redux';
import { setSelectedId } from '@/redux/slices/blogMenu';
import { useNavigate } from 'react-router';

// util
import { getLimitString } from '@/utils';

interface showBlogObj {
  title: string;
  id: string;
  _id: string;
}

const truncateString = (str: string) => {
  const maxLen = 28;
  let actualLen = 0;
  let result = '';

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (char.match(/[\u4e00-\u9fff]/)) {
      // 如果是中文字符
      actualLen += 4;
    } else {
      actualLen += 1;
    }

    if (actualLen <= maxLen) {
      result += char;
    } else {
      result += '...';
      break;
    }
  }

  return result;
};

const ShowBlogs = () => {
  const message = useGlobalMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<showBlogObj[]>([]);
  useEffect(() => {
    getSelfBlogsOfCertain({ page: '1', limit: '10', fields: 'id,title', sort: '', options: 'isCollected=true' }).then(
      response => {
        setBlogs(response.data.blogs);
      },
      err => {
        message.error(err.message);
      }
    );
  }, []);
  return (
    <div className={style.wrapper}>
      {blogs && blogs.length
        ? blogs.map(blog => {
            return (
              <div
                key={blog.id}
                className={style.blogTitle}
                onClick={() => {
                  dispatch(setSelectedId(blog.id));
                  navigate('/blog');
                }}
              >
                <span className="iconfont">&#xe7df;</span>
                <span>{truncateString(blog.title)}</span>
              </div>
            );
          })
        : undefined}
    </div>
  );
};

export default ShowBlogs;
