import React from 'react';
import MainPage from '@/pages/MainPage';
import TestPage from '@/pages/MainPage/TestPage';
import HomePage from '@/pages/MainPage/HomePage';
import BlogManage from '@/pages/MainPage/BlogManage';
import BlogPage from '@/pages/MainPage/BlogPage';

const router = [
  {
    path: '/',
    element: <MainPage />,
    children: [
      {
        path: '',
        element: <HomePage />,
      },
      {
        path: 'test',
        element: <TestPage />,
      },
      {
        path: 'blog',
        element: <BlogPage />,
      },
      {
        path: 'manage',
        element: <BlogManage />,
      },
    ],
  },
];

export default router;
