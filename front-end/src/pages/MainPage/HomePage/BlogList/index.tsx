import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// comp
import ShowBlogTagList from '@/components/Universal/ShowBlogTagList';

// api
import { getSelfBlogsOfCertain } from '@/api/blog';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// interface
import { blogObj } from '@/interface';

// utils
import { filterLT } from '@/utils';

const BlogList = () => {
  const message = useGlobalMessage();
  const [search] = useSearchParams();
  const page = search.get('page') ? search.get('page') : '1';
  const [blogs, setBlogs] = useState([] as blogObj[]);
  useEffect(() => {
    getSelfBlogsOfCertain({ page: page as string, sort: 'publishAt' }).then(
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
  }, []);

  return <ShowBlogTagList blogs={blogs}></ShowBlogTagList>;
};

export default BlogList;
