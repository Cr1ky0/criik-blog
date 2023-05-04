import React, { useEffect, useState } from 'react';
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
import { filterLT } from '@/utils';

const BlogList = () => {
  const message = useGlobalMessage();
  const [search] = useSearchParams();
  const page = search.get('page') ? search.get('page') : '1';
  const [blogs, setBlogs] = useState([] as blogObj[]);
  useEffect(() => {
    getSelfBlogs(page as string).then(
      res => {
        const blogs = res.data.blogs.map((blog: blogObj) => {
          // 处理后端过滤的<
          const contents = filterLT(blog.contents as string);
          return Object.assign({}, blog, { contents });
        });
        setBlogs(blogs);
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
            const { id, title, contents, author, publishAt, views, belongingMenu, isCollected, likes } = blog;
            return (
              <div key={id} style={{ paddingBottom: '3vh' }}>
                <BlogTagBox
                  blogId={id}
                  title={title}
                  statistic={{
                    id,
                    author: author as string,
                    time: moment(publishAt).format('YYYY-MM-DD'),
                    views: views as number,
                    likes: likes as number,
                    belongingMenu,
                    isCollected: isCollected as boolean,
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
