import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import moment from 'moment/moment';

// comp
import BlogTagBox from '@/components/HomePage/BlogTagBox';

// api
import { getSelfBlogs } from '@/api/blog';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// interface
import { blogObj } from '@/interface';

const BlogList = () => {
  const message = useGlobalMessage();
  const [search] = useSearchParams();
  const page = search.get('page') ? search.get('page') : '1';
  const [blogs, setBlogs] = useState([] as blogObj[]);
  useMemo(() => {
    getSelfBlogs(page as string).then(
      res => {
        setBlogs(res.data.blogs);
      },
      err => {
        message.error(err.message);
      }
    );
  }, [page]);

  return (
    <>
      {blogs && blogs.length ? (
        <>
          {blogs.map(blog => {
            const { id, title, contents, author, publishAt, views, belongingMenu } = blog;
            return (
              <div key={id} style={{ paddingBottom: '3vh' }}>
                <BlogTagBox
                  title={title}
                  statistic={{
                    author: author as string,
                    time: moment(publishAt).format('YYYY-MM-DD'),
                    views: views as number,
                    belongingMenu,
                  }}
                >
                  {contents as string}
                </BlogTagBox>
              </div>
            );
          })}
        </>
      ) : (
        <div style={{ fontSize: '20px', textAlign: 'center' }}>当前没有博客...</div>
      )}
    </>
  );
};

export default BlogList;
