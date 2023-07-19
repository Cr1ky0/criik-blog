import React, { Suspense, lazy } from 'react';
import { RouteObject } from 'react-router';
import AuthRoute from '@/pages/AuthRoute';
import LoadingPage from '@/components/LoadingPage';

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
        path: 'photo',
        element: lazy(() => import('@/pages/MainPage/PhotoTimeLine')),
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
      {
        path: 'backstage',
        element: lazy(() => import('@/pages/MainPage/BackStage')),
        children: [
          {
            path: '',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditInfo')),
          },
          {
            path: 'info',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditInfo')),
          },
          {
            path: 'comment',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditComment')),
          },
          {
            path: 'blog',
            element: lazy(() => import('@/pages/MainPage/BackStage/BlogManage')),
          },
          {
            path: 'photo',
            element: lazy(() => import('@/pages/MainPage/BackStage/AddPhoto')),
          },
          {
            path: 'editPhoto',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditPhoto')),
            children: [
              {
                path: '',
                element: lazy(() => import('@/pages/MainPage/BackStage/EditPhoto/EditCertain')),
              },
            ],
          },
          {
            path: 'oss',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditOSS')),
          },
          {
            path: 'smtp',
            element: lazy(() => import('@/pages/MainPage/BackStage/EditSMTP')),
          },
        ],
      },
      // {
      //   path: 'test',
      //   element: lazy(() => import('@/pages/MainPage/TestPage')),
      // },
    ],
  },
  {
    path: '*',
    element: lazy(() => import('@/components/ErrorPage/Page404')),
  },
];

const syncRouter = (table: Routes[]): RouteObject[] => {
  const routeTable: RouteObject[] = [];
  table.forEach(route => {
    routeTable.push({
      path: route.path,
      element: (
        <Suspense fallback={<LoadingPage></LoadingPage>}>
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
