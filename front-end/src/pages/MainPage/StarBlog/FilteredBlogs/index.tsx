import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// comp
import ShowBlogTagList from '@/components/Universal/ShowBlogTagList';

// api
import { getSelfBlogsOfCertain } from '@/api/blog';

// context
import { useGlobalMessage } from '@/components/ContextProvider/MessageProvider';

// util
import { filterLT } from '@/utils';

// interface
import { blogObj } from '@/interface';

const FilteredBlogs = () => {
  const message = useGlobalMessage();
  // params参数
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') ? searchParams.get('filter') : 0;
  const option = parseInt(filter as string);
  const page = searchParams.get('page') ? searchParams.get('page') : '1';
  const [blogs, setBlogs] = useState([] as blogObj[]);
  // 请求参数
  const options = [
    { page: page as string, limit: '10', fields: '', sort: '', options: 'isCollected=true' },
    { page: page as string, limit: '10', fields: '', sort: '-likes' },
    { page: page as string, limit: '10', fields: '', sort: '-views' },
  ];
  useEffect(() => {
    getSelfBlogsOfCertain(options[option]).then(
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
  }, [page, option]);
  return <ShowBlogTagList blogs={blogs}></ShowBlogTagList>;
};
export default FilteredBlogs;
