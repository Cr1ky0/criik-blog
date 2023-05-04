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

interface showBlogObj {
  title: string;
  id: string;
  _id: string;
}

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
                <span>{blog.title}</span>
              </div>
            );
          })
        : undefined}
    </div>
  );
};

export default ShowBlogs;
