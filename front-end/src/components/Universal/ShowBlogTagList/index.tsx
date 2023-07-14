import React from 'react';
import moment from 'moment';

// comp
import BlogTagBox from '@/components/HomePage/BlogTagBox';

// interface
import { BlogObj } from '@/interface';

interface ShowBlogTagListProps {
  blogs: BlogObj[];
}

const ShowBlogTagList: React.FC<ShowBlogTagListProps> = ({ blogs }) => {
  return (
    <>
      {blogs && blogs.length ? (
        <>
          {blogs.map(blog => {
            const { id, title, contents, author, publishAt, views, belongingMenu, isCollected, likes } = blog;
            return (
              <div key={id} style={{ paddingBottom: '20px' }}>
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
        <div style={{ fontSize: '20px', textAlign: 'center' }}></div>
      )}
    </>
  );
};

export default ShowBlogTagList;
