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
import { BlogObj } from '@/interface';
import { useAppSelector } from '@/redux';

const FilteredBlogs = () => {
  const message = useGlobalMessage();
  // params参数
  const [searchParams] = useSearchParams();
  const page = useAppSelector(state => state.universal.starBlogPage);
  const chosen = useAppSelector(state => state.blog.chosen);
  const filter = searchParams.get('filter') ? searchParams.get('filter') : chosen;
  const option = parseInt(filter as string);
  const [blogs, setBlogs] = useState([] as BlogObj[]);
  // 请求参数
  const options = [
    { page: String(page), limit: '10', fields: '', sort: '', options: 'isCollected=true' },
    { page: String(page), limit: '10', fields: '', sort: '-likes' },
    { page: String(page), limit: '10', fields: '', sort: '-views' },
  ];
  useEffect(() => {
    getSelfBlogsOfCertain(options[option]).then(
      res => {
        const blogs = res.data.blogs.map((blog: BlogObj) => {
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
  }, [filter, page]);
  return <ShowBlogTagList blogs={blogs}></ShowBlogTagList>;
};
export default FilteredBlogs;
