import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router';
import MainPage from '@/pages/MainPage';
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

export type Routes = {
  path: string;
  element: React.LazyExoticComponent<any>;
  children?: Routes[];
};

const router: Routes[] = [
  {
    path: '/',
    element: lazy(() => import('@/pages/MainPage')),
    children: [
      {
        path: '',
        element: lazy(() => import('@/pages/MainPage/HomePage')),
        children: [
          {
            path: '',
            element: lazy(() => import('@/pages/MainPage/HomePage/BlogList')),
          },
        ],
      },
      {
        path: 'blog',
        element: lazy(() => import('@/pages/MainPage/BlogPage')),
        children: [
          {
            path: '',
            element: lazy(() => import('@/pages/MainPage/BlogPage/BlogContent')),
          },
        ],
      },
      {
        path: 'manage',
        element: lazy(() => import('@/pages/MainPage/BlogManage')),
      },
      {
        path: 'stars',
        element: lazy(() => import('@/pages/MainPage/StarBlog')),
        children: [
          {
            path: '',
            element: lazy(() => import('@/pages/MainPage/StarBlog/FilteredBlogs')),
          },
        ],
      },
    ],
  },
];

const syncRouter = (table: Routes[]): RouteObject[] => {
  const routeTable: RouteObject[] = [];
  table.forEach(route => {
    routeTable.push({
      path: route.path,
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthRoute>
            <route.element />
          </AuthRoute>
        </Suspense>
      ),
      children: route.children && syncRouter(route.children),
    });
  });
  return routeTable;
};

export default syncRouter(router);
