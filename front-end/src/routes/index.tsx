import React from 'react';
import MainPage from '@/pages/MainPage';
import TestPage from '@/pages/MainPage/TestPage';
import HomePage from '@/pages/MainPage/HomePage';

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
    ],
  },
];

export default router;
