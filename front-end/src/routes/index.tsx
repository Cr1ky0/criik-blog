import React from 'react';
import MainPage from '@/pages/MainPage';
import TestPage from '@/pages/MainPage/TestPage';
import AuthRoute from '@/pages/AuthRoute';

// home
import HomePage from '@/pages/MainPage/HomePage';
import BlogList from '@/pages/MainPage/HomePage/BlogList';

// manage
import BlogManage from '@/pages/MainPage/BlogManage';

// blog
import BlogPage from '@/pages/MainPage/BlogPage';
import BlogContent from '@/pages/MainPage/BlogPage/BlogContent';

// stars
import StarBlog from '@/pages/MainPage/StarBlog';
import FilteredBlogs from '@/pages/MainPage/StarBlog/FilteredBlogs';

const router = [
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
        children: [
          {
            path: '',
            element: <BlogList></BlogList>,
          },
        ],
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
        children: [
          {
            path: '',
            element: <BlogContent></BlogContent>,
          },
        ],
      },
      {
        path: 'manage',
        element: (
          <AuthRoute>
            <BlogManage />
          </AuthRoute>
        ),
      },
      {
        path: 'stars',
        element: <StarBlog></StarBlog>,
        children: [
          {
            path: '',
            element: <FilteredBlogs></FilteredBlogs>,
          },
        ],
      },
    ],
  },
];

export default router;
